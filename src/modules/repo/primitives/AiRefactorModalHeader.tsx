import React from 'react';
import { Wand2, X } from 'lucide-react';

interface AiRefactorModalHeaderProps {
  onClose: () => void;
}

export function AiRefactorModalHeader({ onClose }: AiRefactorModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-purple-600 text-white rounded-lg shadow-xs">
          <Wand2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 leading-none">
            AI Code Refactoring & Modular Decomposition
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
            Analisis riil kode sumber repositori, pengetatan tipe TypeScript, dan penulisan langsung ke berkas
          </p>
        </div>
      </div>
      <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
