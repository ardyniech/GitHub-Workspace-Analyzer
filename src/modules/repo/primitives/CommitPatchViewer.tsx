import React from 'react';
import { CommitFileChange } from '../storage/commitApi';
import { FileCode, Plus, Minus } from 'lucide-react';

interface CommitPatchViewerProps {
  key?: React.Key;
  file: CommitFileChange;
}

export function CommitPatchViewer({ file }: CommitPatchViewerProps) {
  const lines = (file.patch || '').split('\n');

  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white text-xs">
      <div className="px-3 py-2 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="font-semibold text-zinc-800 truncate">{file.filename}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center text-emerald-600 font-bold">
            <Plus className="w-3 h-3" />{file.additions}
          </span>
          <span className="flex items-center text-rose-600 font-bold">
            <Minus className="w-3 h-3" />{file.deletions}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9.5px] uppercase font-bold bg-zinc-200 text-zinc-700">
            {file.status}
          </span>
        </div>
      </div>

      {file.patch ? (
        <div className="font-mono text-[10.5px] leading-relaxed max-h-[220px] overflow-auto p-2 bg-zinc-950 text-zinc-200">
          {lines.map((line, idx) => {
            let lineClass = 'text-zinc-400';
            if (line.startsWith('+') && !line.startsWith('+++')) {
              lineClass = 'bg-emerald-950/40 text-emerald-300 font-medium';
            } else if (line.startsWith('-') && !line.startsWith('---')) {
              lineClass = 'bg-rose-950/40 text-rose-300 opacity-80';
            } else if (line.startsWith('@')) {
              lineClass = 'bg-zinc-900 text-indigo-300 font-bold px-1 rounded-xs';
            }

            return (
              <div key={idx} className={`px-2 py-0.5 rounded-xs whitespace-pre ${lineClass}`}>
                {line}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-zinc-400 text-xs italic bg-zinc-50">
          Berkas biner atau tidak ada cuplikan diff langsung.
        </div>
      )}
    </div>
  );
}
