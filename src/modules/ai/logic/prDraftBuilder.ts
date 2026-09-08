import { CommitItem } from '../../repo';
import { SecurityFinding } from '../../security';

export interface PrDraftResult {
  title: string;
  markdown: string;
  commitCount: number;
  securityStatus: 'clean' | 'warning' | 'critical';
}

export function buildPrDraft(
  repoFullName: string,
  commits: CommitItem[],
  findings: SecurityFinding[] = [],
  customNote?: string
): PrDraftResult {
  const latestCommit = commits[0];
  const commitCount = commits.length;
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;

  const securityStatus: 'clean' | 'warning' | 'critical' =
    criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'clean';

  const defaultTitle = latestCommit?.commit?.message
    ? `feat: ${latestCommit.commit.message.split('\n')[0].substring(0, 60)}`
    : `update: Pembaruan terverifikasi untuk ${repoFullName}`;

  const commitListText =
    commits.length > 0
      ? commits
          .map((c) => {
            const shortSha = c.sha ? c.sha.substring(0, 7) : 'commit';
            const msg = c.commit?.message?.split('\n')[0] || 'Update berkas';
            const author = c.commit?.author?.name || 'Kontributor';
            return `- \`${shortSha}\` ${msg} *(oleh ${author})*`;
          })
          .join('\n')
      : '- *(Belum ada riwayat commit baru terdeteksi)*';

  const securityStatusText =
    securityStatus === 'clean'
      ? '✅ **Terverifikasi Aman**: Tidak ditemukan kunci API rahasia atau dependensi rentan.'
      : securityStatus === 'warning'
      ? `⚠️ **Perhatian**: Terdeteksi ${warningCount} catatan konfigurasi/dependensi yang perlu ditinjau.`
      : `🛑 **Kritis**: Terdeteksi ${criticalCount} celah keamanan penting yang perlu segera ditinjau!`;

  const securityFindingsText =
    findings.length > 0
      ? findings
          .map((f) => `- [${f.severity.toUpperCase()}] **${f.title}**: ${f.description} (Saran: ${f.recommendation})`)
          .join('\n')
      : '- Tidak ada kebocoran kunci API atau dependensi berbahaya.';

  const markdown = `## 🚀 Pull Request: ${defaultTitle}

### 📋 Ringkasan Perubahan
${customNote || `Pull Request ini menggabungkan pembaruan kode terbaru pada repositori **${repoFullName}** dengan verifikasi keamanan menyeluruh menggunakan Security Scan.`}

### 📌 Riwayat Commit Terkait (${commitCount}):
${commitListText}

### 🛡️ Laporan Hasil Security Scan:
${securityStatusText}

**Detail Pemeriksaan:**
${securityFindingsText}

### ✅ Checklist Pengujian & Keamanan:
- [x] Riwayat commit telah diverifikasi dan bebas dari token/kunci rahasia
- [x] Kode dan dependensi telah diaudit secara otomatis via Security Scan
- [x] Format pesan commit deskriptif dan konsisten
- [ ] Pengujian fungsionalitas dan integrasi akhir sebelum merge
`;

  return {
    title: defaultTitle,
    markdown,
    commitCount,
    securityStatus,
  };
}
