import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { VoiceStatus } from '../logic/useLiveVoice';
import { Mic, MicOff, Volume2, Radio, X, AlertCircle } from 'lucide-react';

interface LiveVoiceModalProps {
  status: VoiceStatus;
  errorMessage: string | null;
  volumeLevel: number;
  repoFullName: string | undefined;
  onStart: () => void;
  onStop: () => void;
  onClose: () => void;
}

export function LiveVoiceModal({
  status,
  errorMessage,
  volumeLevel,
  repoFullName,
  onStart,
  onStop,
  onClose,
}: LiveVoiceModalProps) {
  const isLive = status === 'listening' || status === 'speaking';
  const getOrbStyle = () => {
    if (status === 'speaking') return 'bg-purple-100 ring-8 ring-purple-200 animate-pulse text-purple-700';
    if (status === 'listening') return 'bg-emerald-100 ring-8 ring-emerald-200 text-emerald-700';
    if (status === 'connecting') return 'bg-amber-100 ring-8 ring-amber-200 text-amber-700 animate-spin';
    return 'bg-zinc-100 text-zinc-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
        <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600 text-white"><Radio className="w-4 h-4 animate-pulse" /></div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Percakapan Suara Real-Time</h3>
              <p className="text-[10px] text-zinc-500">Live API Gemini Suara Interaktif</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 flex flex-col items-center justify-center gap-3 text-center">
          <span className="text-[9.5px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            ⚡ gemini-3.1-flash-live-preview
          </span>
          <div className="relative flex items-center justify-center my-1">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${getOrbStyle()}`}
              style={{ transform: isLive ? `scale(${1 + volumeLevel * 0.25})` : 'scale(1)' }}
            >
              {status === 'speaking' ? <Volume2 className="w-8 h-8" /> : isLive ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-zinc-800">
              {status === 'speaking' ? 'AI Sedang Berbicara...' : status === 'listening' ? 'Mendengarkan Suara Anda...' : status === 'connecting' ? 'Menghubungkan Saluran...' : 'Siap Berbicara'}
            </p>
            <p className="text-[11px] text-zinc-500 max-w-xs">
              {isLive ? `Bicaralah mengenai repositori ${repoFullName || 'Anda'}. AI menjawab secara verbal.` : 'Tekan tombol di bawah untuk mulai dialog suara.'}
            </p>
          </div>
          {errorMessage && (
            <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 flex items-center gap-1.5 text-left">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={onClose} className="text-xs text-zinc-600">Tutup</Button>
          {isLive ? (
            <Button size="sm" onClick={onStop} icon={<MicOff className="w-3.5 h-3.5" />} className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white">
              Hentikan Suara
            </Button>
          ) : (
            <Button size="sm" onClick={onStart} icon={<Mic className="w-3.5 h-3.5" />} className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white">
              Mulai Bicara
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
