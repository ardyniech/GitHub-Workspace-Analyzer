import React from 'react';
import { VoiceCommanderStatus } from '../logic/types';
import { Mic, MicOff, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface VoiceCommanderVisualizerProps {
  status: VoiceCommanderStatus;
  volumeLevel: number;
  onToggleListen: () => void;
}

export function VoiceCommanderVisualizer({ status, volumeLevel, onToggleListen }: VoiceCommanderVisualizerProps) {
  const isListening = status === 'listening';
  const scaleEffect = isListening ? 1 + Math.min(volumeLevel * 0.8, 0.5) : 1;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden">
      {/* Background ripple ring when active */}
      {isListening && (
        <div
          className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping pointer-events-none"
          style={{ transform: `scale(${scaleEffect * 1.2})`, opacity: Math.max(0.2, volumeLevel) }}
        />
      )}

      {/* Main Microphone Action Sphere */}
      <button
        type="button"
        onClick={onToggleListen}
        style={{ transform: `scale(${scaleEffect})` }}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-100 cursor-pointer shadow-lg z-10 ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50'
            : status === 'executing'
            ? 'bg-amber-600 text-white'
            : status === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
        }`}
        title={isListening ? 'Klik untuk berhenti mendengar' : 'Klik untuk mulai bicara'}
      >
        {isListening ? (
          <Mic className="w-7 h-7 animate-pulse" />
        ) : status === 'executing' ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle2 className="w-7 h-7" />
        ) : (
          <MicOff className="w-7 h-7 text-zinc-400" />
        )}
      </button>

      {/* Real-time volume bars */}
      <div className="flex items-center gap-1 mt-3 h-4">
        {[0.2, 0.4, 0.7, 0.9, 0.6, 0.3].map((factor, i) => (
          <div
            key={i}
            className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
            style={{
              height: isListening ? `${Math.max(4, volumeLevel * 20 * factor)}px` : '4px',
              opacity: isListening ? Math.max(0.3, volumeLevel * factor) : 0.2,
            }}
          />
        ))}
      </div>

      <p className="text-xs font-semibold mt-2 text-zinc-300 flex items-center gap-1.5">
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Mendengarkan suara Anda... Silakan bicara</span>
          </>
        ) : status === 'executing' ? (
          <span>Mengeksekusi perintah...</span>
        ) : status === 'success' ? (
          <span className="text-emerald-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Perintah berhasil dijalankan!</span>
        ) : (
          <span className="text-zinc-400">Ketuk ikon mikrofon untuk berbicara</span>
        )}
      </p>
    </div>
  );
}
