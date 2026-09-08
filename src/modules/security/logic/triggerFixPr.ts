import { dispatcher } from '../../../core/dispatcher';
import { ManifestAuditResult } from './manifestTypes';

export function triggerGenerateFixPr(
  repoFullName: string,
  auditResult: ManifestAuditResult
) {
  const vulnList = auditResult.vulnerabilities
    .map(
      (v) =>
        `- **${v.packageName}** (${v.installedVersion} → ${v.fixedIn || 'latest'}): ${v.title} [Tingkat: ${v.severity}]`
    )
    .join('\n');

  const prompt = `Tolong buatkan draf Pull Request (Fix PR Draft Proposal) komprehensif untuk repositori "${repoFullName}" guna memperbarui dependensi yang rentan/usang pada \`${auditResult.manifestPath}\`.

Daftar temuan kerentanan:
${vulnList || 'Audit dependensi rutin'}

Mohon sertakan:
1. **Judul PR** & rekomendasi **Branch Name** (contoh: \`fix/security-bump-${auditResult.manifestType}\`).
2. **Draf Deskripsi PR & Release Notes** (penjelasan risiko & perbaikan).
3. **Kode Diff (Before & After)** yang presisi untuk \`${auditResult.manifestPath}\`.
4. **Langkah Uji Regresi (Testing Checklist)** setelah update dependensi.`;

  // Push immediate notification that Fix PR generation started
  dispatcher.emit('notify:push', {
    type: 'info',
    title: 'Memproses Generate Fix PR...',
    message: `Gemini AI sedang menyusun kode diff dan draf Pull Request untuk ${auditResult.manifestPath}.`,
  });

  dispatcher.emit('ai:send_prompt', { prompt, isFixPr: true });
}
