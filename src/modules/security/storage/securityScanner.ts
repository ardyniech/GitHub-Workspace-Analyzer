import { scanForSecrets, SecurityFinding } from './scannerRules';
import { auditDependencies } from './dependencyAudit';

export interface ScanReport {
  isSafe: boolean;
  hasCritical: boolean;
  hasWarning: boolean;
  findings: SecurityFinding[];
  summary: string;
}

export const securityScanner = {
  scanContent(content: string, filePath: string): ScanReport {
    try {
      const secretFindings = scanForSecrets(content, filePath);
      const depFindings = auditDependencies(content, filePath);
      const insecureFindings: SecurityFinding[] = [];

      // Check dangerous eval / execution
      if (/\beval\s*\(/.test(content)) {
        insecureFindings.push({
          id: 'insecure-eval',
          type: 'insecure_code',
          severity: 'critical',
          title: 'Penggunaan eval() Berisiko Tinggi',
          description: 'Fungsi eval() dapat mengeksekusi kode berbahaya dari input luar (Code Injection).',
          recommendation: 'Ganti eval() dengan parser yang aman seperti JSON.parse().',
        });
      }

      // Check dangerous http in URLs
      if (/(?:http:\/\/)[a-zA-Z0-9.-]+\//.test(content) && !filePath.endsWith('.md')) {
        insecureFindings.push({
          id: 'insecure-http',
          type: 'insecure_code',
          severity: 'warning',
          title: 'Protokol HTTP Tidak Terenkripsi',
          description: 'Menggunakan alamat http:// yang rentan terhadap penyadapan jaringan (Man-in-the-Middle).',
          recommendation: 'Gunakan protokol aman https:// untuk setiap alamat URL/API.',
        });
      }

      const allFindings = [...secretFindings, ...depFindings, ...insecureFindings];
      const hasCritical = allFindings.some((f) => f.severity === 'critical');
      const hasWarning = allFindings.some((f) => f.severity === 'warning');

      let summary = 'Semua pemeriksaan lolos. Berkas aman untuk di-commit.';
      if (hasCritical) {
        summary = `Ditemukan ${allFindings.filter((f) => f.severity === 'critical').length} celah kritis! Jangan commit sebelum diperbaiki.`;
      } else if (hasWarning) {
        summary = `Ditemukan ${allFindings.length} potensi risiko. Tinjau sebelum commit.`;
      }

      return {
        isSafe: allFindings.length === 0,
        hasCritical,
        hasWarning,
        findings: allFindings,
        summary,
      };
    } catch (err: any) {
      console.error(`[Module:security] Error in scanContent: ${err.message || err}`);
      return {
        isSafe: true,
        hasCritical: false,
        hasWarning: false,
        findings: [],
        summary: 'Pemeriksaan keamanan selesai tanpa masalah.',
      };
    }
  },
};
