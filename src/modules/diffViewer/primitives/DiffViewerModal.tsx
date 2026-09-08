import React from 'react';
import { DiffView } from './DiffView';
import { FileCode, X } from 'lucide-react';

interface DiffViewerModalProps {
  fileName: string;
  originalCode: string;
  modifiedCode: string;
  onClose: () => void;
}

export function DiffViewerModal({ fileName, originalCode, modifiedCode, onClose }: DiffViewerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 rounded-2xl max-w-4xl w-full p-4 border border-zinc-800 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-950/80 text-purple-400 rounded-lg border border-purple-800">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 leading-none">Code Diff Inspector</h3>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                Evaluasi perubahan berkas secara presisi sebelum diteruskan ke commit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <DiffView fileName={fileName} originalCode={originalCode} modifiedCode={modifiedCode} />
      </div>
    </div>
  );
}
