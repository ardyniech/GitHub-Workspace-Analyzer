import React from 'react';
import { ArrowUpRight, ShieldCheck, GitPullRequest } from 'lucide-react';

interface AiChatSuggestionsProps {
  onSelect: (text: string) => void;
  onGeneratePrDraft: () => void;
  disabled: boolean;
}

export const SUGGESTIONS = [
  {
    label: '🛡️ Pindai Keamanan (Security Scan)',
    prompt:
      'Lakukan Security Scan mendalam pada kode repositori ini: periksa potensi kebocoran kunci API, kredensial terbuka, dependensi usang, dan celah keamanan lainnya. Berikan solusi perbaikannya.',
    highlight: true,
  },
  {
    label: '⚡ Edit beberapa berkas sekaligus (Multi-file)',
    prompt:
      'Bantu saya membuat fitur baru atau perbaikan yang memodifikasi beberapa berkas sekaligus di repositori ini secara terintegrasi.',
    highlight: false,
  },
  {
    label: '📦 Edit hingga 30 berkas sekaligus (Batch 30)',
    prompt:
      'Bantu saya melakukan pembaruan atau standardisasi masif pada hingga 30 berkas di repositori ini secara bersamaan.',
    highlight: false,
  },
  {
    label: 'Buatkan usulan fitur baru & commit',
    prompt: 'Buatkan usulan fitur baru & commit untuk repositori ini.',
    highlight: false,
  },
  {
    label: 'Perbaiki bug dan optimalkan kode',
    prompt: 'Perbaiki bug dan optimalkan kode di repositori ini.',
    highlight: false,
  },
];

export function AiChatSuggestions({ onSelect, onGeneratePrDraft, disabled }: AiChatSuggestionsProps) {
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>Saran Analisis & Tindakan Otomatis:</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onGeneratePrDraft}
          disabled={disabled}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-bold border rounded-full transition-all duration-150 text-left cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs"
        >
          <GitPullRequest className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>🚀 Buat Draft PR (Auto Scan & Commit)</span>
        </button>

        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(s.prompt)}
            disabled={disabled}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium border rounded-full transition-all duration-150 text-left cursor-pointer ${
              s.highlight
                ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>{s.label}</span>
            <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
