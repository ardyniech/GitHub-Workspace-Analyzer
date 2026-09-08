import React from 'react';
import { useVoiceCommander } from '../logic/useVoiceCommander';
import { VoiceCommanderVisualizer } from './VoiceCommanderVisualizer';
import { VoiceIntentCard } from './VoiceIntentCard';
import { VoiceSuggestionChips } from './VoiceSuggestionChips';
import { Button } from '../../../shared/atoms/Button';
import { X, Play, RotateCcw, AlertCircle } from 'lucide-react';

interface VoiceCommanderModalProps {
  repoFullName?: string;
  token?: string | null;
  onClose: () => void;
}

export function VoiceCommanderModal({ repoFullName, token, onClose }: VoiceCommanderModalProps) {
  const {
    status, transcript, volumeLevel, intent, errorMessage, searchResults, executionMessage,
    startListening, stopListening, executeIntent, setManualCommand, reset
  } = useVoiceCommander(repoFullName, token);

  const suggestions = [
    'Analisis keamanan repositori ini',
    'Cari file package.json',
    'Buat issue: Perbaiki navbar pada layar mobile',
  ];

  const handleToggle = () => {
    if (status === 'listening') stopListening();
    else startListening();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[92vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 leading-none">AI Voice Commander</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Kontrol repositori via suara: Analisis, Cari Berkas, atau Buat Issue</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visualizer & Mic Toggle */}
        <VoiceCommanderVisualizer status={status} volumeLevel={volumeLevel} onToggleListen={handleToggle} />

        {/* Live Transcript */}
        {transcript && (
          <div className="p-2.5 bg-zinc-100/80 rounded-xl border border-zinc-200 flex flex-col gap-1">
            <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">Transkrip Ucapan:</span>
            <p className="text-zinc-900 font-medium text-xs italic">"{transcript}"</p>
          </div>
        )}

        {/* Error / Notification */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="text-xs font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Execution Success Message */}
        {executionMessage && (
          <p className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
            {executionMessage}
          </p>
        )}

        {/* Detected Intent Card */}
        {intent && intent.type !== 'UNKNOWN' && (
          <VoiceIntentCard intent={intent} searchResults={searchResults} />
        )}

        {/* Suggestions chips */}
        {!transcript && (
          <VoiceSuggestionChips suggestions={suggestions} onSelect={setManualCommand} />
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
          <Button variant="ghost" size="sm" onClick={reset} icon={<RotateCcw className="w-3.5 h-3.5" />} className="h-7 text-xs">
            Reset
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} className="h-7 text-xs">
              Tutup
            </Button>
            {intent && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => executeIntent()}
                disabled={status === 'executing'}
                icon={<Play className="w-3.5 h-3.5" />}
                className="h-7 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Eksekusi Sekarang
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
