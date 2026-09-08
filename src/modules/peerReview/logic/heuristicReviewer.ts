import { PeerReviewReport, PeerReviewFinding } from './types';

export function runHeuristicPeerReview(codeOrDiff: string, filenameOrPr: string): PeerReviewFinding[] {
  const findings: PeerReviewFinding[] = [];
  const lines = codeOrDiff.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // 1. Logic bug heuristics
    if (trimmed.includes('== null') || trimmed.includes('!= null')) {
      findings.push({
        id: `hb-null-${lineNum}`,
        category: 'logic_bug',
        severity: 'warning',
        title: 'Penggunaan Loose Null Check',
        description: 'Pemeriksaan `== null` bisa menghasilkan evaluasi implisit yang tidak diinginkan.',
        lineNumber: lineNum,
        snippet: line,
        suggestion: 'Gunakan strict equality `=== null || === undefined` atau optional chaining `?.`',
      });
    }

    if (/\b(password|secret|token|api_key|apiKey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{8,}['"]/i.test(trimmed)) {
      findings.push({
        id: `hb-sec-${lineNum}`,
        category: 'security_flaw',
        severity: 'critical',
        title: 'Potensi Hardcoded Secret / Credential',
        description: 'Terdeteksi string berformat rahasia atau token di dalam kode.',
        lineNumber: lineNum,
        snippet: line,
        suggestion: 'Pindahkan secret ke environment variable (`process.env`).',
      });
    }

    // 2. Redundancy heuristics
    if (/console\.(log|debug|info)\(/.test(trimmed)) {
      findings.push({
        id: `hb-red-log-${lineNum}`,
        category: 'redundancy',
        severity: 'suggestion',
        title: 'Sisa Debugging console.log',
        description: 'Panggilan `console.log` tidak disarankan masuk ke kode produksi.',
        lineNumber: lineNum,
        snippet: line,
        suggestion: 'Hapus atau ganti dengan logger terpusat terstandar.',
      });
    }

    // 3. Style / Type convention heuristics
    if (/: any\b/.test(trimmed)) {
      findings.push({
        id: `hb-style-any-${lineNum}`,
        category: 'style_convention',
        severity: 'warning',
        title: 'Penggunaan Tipe `any` Terdeteksi',
        description: 'Tipe `any` mengurangi manfaat keamanan statis TypeScript.',
        lineNumber: lineNum,
        snippet: line,
        suggestion: 'Definisikan interface atau tipe eksplisit di `types.ts`.',
      });
    }

    if (trimmed.startsWith('// TODO') || trimmed.startsWith('// FIXME')) {
      findings.push({
        id: `hb-todo-${lineNum}`,
        category: 'style_convention',
        severity: 'suggestion',
        title: 'Komentar TODO/FIXME Belum Diselesaikan',
        description: 'Terdapat catatan pekerjaan tertunda yang perlu ditindaklanjuti sebelum merge.',
        lineNumber: lineNum,
        snippet: line,
        suggestion: 'Selesaikan pekerjaan atau buat Issue pelacak tersendiri.',
      });
    }
  });

  return findings;
}
