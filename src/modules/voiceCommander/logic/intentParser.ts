import { VoiceCommandIntent } from './types';

export function parseVoiceIntent(rawTranscript: string): VoiceCommandIntent {
  const text = rawTranscript.trim().toLowerCase();

  // 1. Issue Creation
  const issueKeywords = ['buat issue', 'bikin issue', 'create issue', 'tambah issue', 'laporkan bug', 'report bug'];
  for (const kw of issueKeywords) {
    if (text.includes(kw)) {
      const remainder = rawTranscript.substring(text.indexOf(kw) + kw.length).replace(/^[:\s\-]+/, '').trim();
      const title = remainder ? remainder.charAt(0).toUpperCase() + remainder.slice(1) : 'Temuan dari Voice Commander';
      return {
        type: 'CREATE_ISSUE',
        confidence: 0.95,
        label: 'Buat Issue Baru',
        description: `Mendaftarkan issue baru ke repositori dengan judul "${title}".`,
        params: { issueTitle: title, issueBody: `Dibuat secara otomatis melalui AI Voice Commander.\n\nPerintah Asli: "${rawTranscript}"` },
      };
    }
  }

  // 2. File Searching
  const fileKeywords = ['cari file', 'cari berkas', 'temukan file', 'buka file', 'search file', 'find file', 'cari', 'temukan'];
  for (const kw of fileKeywords) {
    if (text.startsWith(kw) || text.includes(kw)) {
      const rawTarget = rawTranscript.substring(text.indexOf(kw) + kw.length).replace(/^[:\s\-]+/, '').trim();
      if (rawTarget.length > 0) {
        return {
          type: 'SEARCH_FILE',
          confidence: 0.92,
          label: 'Pencarian Berkas Repositori',
          description: `Mencari semua berkas dan folder yang cocok dengan "${rawTarget}".`,
          params: { query: rawTarget },
        };
      }
    }
  }

  // 3. Repository Analysis
  const analysisKeywords = ['analisis', 'analisa', 'audit', 'review', 'tinjau', 'pemeriksaan', 'periksa', 'analyze', 'health', 'vulnerability', 'keamanan'];
  const hasAnalysis = analysisKeywords.some((kw) => text.includes(kw));
  if (hasAnalysis) {
    let topic = 'keamanan dan arsitektur umum';
    if (text.includes('keamanan') || text.includes('security') || text.includes('vulnerability')) topic = 'keamanan & celah dependensi';
    else if (text.includes('arsitektur') || text.includes('struktur')) topic = 'arsitektur dan modularitas kode';
    else if (text.includes('performa') || text.includes('kinerja')) topic = 'performa & optimasi memory';

    return {
      type: 'ANALYZE_REPO',
      confidence: 0.94,
      label: 'Analisis Repositori Komprehensif',
      description: `Memicu Agen AI untuk mengaudit ${topic} secara mendalam.`,
      params: { analysisTopic: topic },
    };
  }

  // Fallback to Search or Generic AI prompt
  return {
    type: 'UNKNOWN',
    confidence: 0.5,
    label: 'Perintah Belum Dikenali',
    description: `Ucapan "${rawTranscript}" tidak cocok dengan pola Analisis, Cari File, atau Buat Issue.`,
    params: { query: rawTranscript },
  };
}
