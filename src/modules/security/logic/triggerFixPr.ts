import { dispatcher } from '../../../core/dispatcher';
import { ManifestAuditResult, VulnerabilityItem } from './manifestTypes';

export function buildAuditAgentPrompt(
  repoFullName: string,
  auditResult: ManifestAuditResult,
  specificVuln?: VulnerabilityItem
): string {
  const items = specificVuln ? [specificVuln] : auditResult.vulnerabilities;
  const list = items
    .map(
      (v) =>
        `- **${v.packageName}** (Versi: \`${v.installedVersion}\` → Target: \`${v.fixedIn || 'latest'}\`): ${v.title} [Severitas: ${v.severity.toUpperCase()}]`
    )
    .join('\n');

  const cleanSuffix = auditResult.manifestType.replace(/[^a-zA-Z0-9]/g, '-');
  const branchName = `fix/audit-${cleanSuffix}-${Date.now().toString().slice(-4)}`;

  return `[TUGAS EKSEKUSI OTONOM AGENT - AUDIT KEAMANAN MANIFES]
Target Repositori: "${repoFullName}"
Berkas Manifes: \`${auditResult.manifestPath}\` (${auditResult.manifestType})
Tingkat Risiko: ${auditResult.overallRisk.toUpperCase()}

Daftar Temuan Audit Dependensi:
${list || '- Tidak ada kerentanan kritis, lakukan peremajaan dependensi aman.'}

Ringkasan Audit:
${auditResult.aiSummary || 'Pemeriksaan keamanan menemukan dependensi yang perlu dinaikkan ke versi aman.'}

INSTRUKSI EKSEKUSI OTONOM:
1. Jika isi berkas \`${auditResult.manifestPath}\` belum diketahui, panggil tool:
\`\`\`tool_call
{"tool": "read_file", "path": "${auditResult.manifestPath}"}
\`\`\`
2. Perbarui versi paket di atas pada \`${auditResult.manifestPath}\` ke versi yang aman.
3. Keluarkan blok \`\`\`copilot untuk otomatis membuat branch baru \`${branchName}\`, commit perubahan, dan membuka Pull Request (PR) ke cabang default:
\`\`\`copilot
{
  "commitMessage": "fix(deps): patch vulnerable dependencies in ${auditResult.manifestPath}",
  "branch": "${branchName}",
  "createPr": {
    "title": "fix(security): patch dependency audit findings in ${auditResult.manifestPath}",
    "body": "Automated security patch based on Manifest Audit findings:\\n${list.replace(/"/g, "'")}"
  },
  "files": [
    {
      "path": "${auditResult.manifestPath}",
      "content": "<ISI_LENGKAP_BERKAS_YANG_TELAH_DIPERBAIKI>"
    }
  ]
}
\`\`\`
Lakukan eksekusi perbaikan sekarang secara otonom!`;
}

export function triggerAgentAuditExecution(
  repoFullName: string,
  auditResult: ManifestAuditResult,
  specificVuln?: VulnerabilityItem
) {
  const prompt = buildAuditAgentPrompt(repoFullName, auditResult, specificVuln);
  const targetLabel = specificVuln ? specificVuln.packageName : auditResult.manifestPath;

  dispatcher.emit('notify:push', {
    type: 'info',
    title: 'Memicu Eksekusi Audit AI',
    message: `Agen AI menerima instruksi perbaikan audit untuk ${targetLabel}.`,
  });

  dispatcher.emit('ai:send_prompt', { prompt, isFixPr: true });
}

export const triggerGenerateFixPr = (
  repoFullName: string,
  auditResult: ManifestAuditResult
) => triggerAgentAuditExecution(repoFullName, auditResult);
