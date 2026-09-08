export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: number;
}

export interface ReportOptions {
  repoFullName: string;
  activeModel: string;
  messages: ChatMessage[];
}

export function generateReportMarkdown({
  repoFullName,
  activeModel,
  messages,
}: ReportOptions): string {
  const dateStr = new Date().toLocaleString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const lines: string[] = [];
  lines.push(`# Laporan Analisis Repositori AI`);
  lines.push(`**Repositori:** \`${repoFullName || 'Tidak ditentukan'}\``);
  lines.push(`**Model AI:** \`${activeModel || 'Gemini'}\``);
  lines.push(`**Waktu Pembuatan:** ${dateStr}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 📌 Ringkasan Eksekutif');
  lines.push(
    `Dokumen ini merangkum hasil konsultasi, tinjauan keamanan, dan rekomendasi teknis ` +
      `dari AI Agent untuk repositori \`${repoFullName}\` agar mudah ditinjau bersama tim.`
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 💬 Riwayat Analisis & Rekomendasi Solusi');

  const filtered = messages.filter((m) => m.text && m.text.trim().length > 0);
  let sessionIndex = 1;

  for (let i = 0; i < filtered.length; i++) {
    const msg = filtered[i];
    if (msg.sender === 'user') {
      lines.push('');
      lines.push(`### Sesi ${sessionIndex}: Pertanyaan / Kebutuhan`);
      lines.push(`> ${msg.text.replace(/\n/g, '\n> ')}`);
      sessionIndex++;
    } else {
      lines.push('');
      lines.push(`#### 💡 Jawaban & Rekomendasi AI:`);
      lines.push(msg.text);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## ✅ Rencana Tindak Lanjut Tim (Action Items)');
  lines.push('- [ ] Tinjau rekomendasi dan usulan kode bersama pengembang tim');
  lines.push('- [ ] Pastikan verifikasi Security Scan dilakukan sebelum rilis');
  lines.push('- [ ] Lakukan commit dan Pull Request (PR) sesuai standar repositori');
  lines.push('');
  lines.push('> *Dihasilkan secara otomatis oleh AI Studio - Git & Repo Copilot.*');

  return lines.join('\n');
}

export function downloadMarkdownFile(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err: any) {
    console.error(`[Module:AI] Error in downloadMarkdownFile: ${err?.message || err}`);
  }
}
