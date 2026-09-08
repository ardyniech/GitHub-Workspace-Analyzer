import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { Wand2, CheckCircle2, Sparkles } from 'lucide-react';

interface AiRefactorModalFooterProps {
  isApplied: boolean;
  isApplying: boolean;
  isAnalyzing: boolean;
  hasChanges: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function AiRefactorModalFooter({
  isApplied,
  isApplying,
  isAnalyzing,
  hasChanges,
  onClose,
  onApply,
}: AiRefactorModalFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5">
      <div className="text-[10px] text-zinc-500">
        {isApplied && (
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Refaktor tersimpan di disk & dicatat di Git!
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isApplying}>
          Tutup
        </Button>
        <Button
          size="sm"
          onClick={onApply}
          disabled={isApplying || isApplied || isAnalyzing || !hasChanges}
          icon={isApplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : isApplying ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold h-8 text-[11px] px-3.5 rounded-lg shadow-2xs"
        >
          {isApplied ? 'Telah Diterapkan ke Berkas' : isApplying ? 'Menerapkan ke Berkas...' : 'Terapkan Refactor Riil'}
        </Button>
      </div>
    </div>
  );
}
