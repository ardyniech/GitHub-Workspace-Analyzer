import React, { useState } from 'react';
import { FileCode, Layers, Search, CheckSquare, Square } from 'lucide-react';
import { CopilotFile } from '../logic/copilotProposalParser';

interface CopilotFileTabsProps {
  files: CopilotFile[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  selectedPaths: Set<string>;
  onTogglePath: (path: string) => void;
  onToggleAll: () => void;
}

export function CopilotFileTabs({
  files,
  activeIndex,
  onSelectIndex,
  selectedPaths,
  onTogglePath,
  onToggleAll,
}: CopilotFileTabsProps) {
  const [query, setQuery] = useState('');
  if (files.length <= 1) return null;

  const filtered = query.trim()
    ? files.filter((f) => f.path.toLowerCase().includes(query.toLowerCase()))
    : files;

  const allSelected = selectedPaths.size === files.length;

  return (
    <div className="flex flex-col gap-2 p-2 bg-zinc-100/90 rounded-lg border border-zinc-200">
      <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500">
        <span className="flex items-center gap-1 text-zinc-800">
          <Layers className="w-3.5 h-3.5 text-zinc-600" />
          <span>Berkas ({selectedPaths.size}/{files.length} dipilih):</span>
        </span>
        <button
          type="button"
          onClick={onToggleAll}
          className="text-zinc-600 hover:text-zinc-900 underline text-[9.5px] cursor-pointer"
        >
          {allSelected ? 'Batal Pilih Semua' : 'Pilih Semua (30)'}
        </button>
      </div>

      {files.length > 5 && (
        <div className="relative">
          <Search className="w-3 h-3 text-zinc-400 absolute left-2 top-2" />
          <input
            type="text"
            placeholder={`Cari dari ${files.length} berkas...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-6 pr-2 py-1 text-[10px] bg-white border border-zinc-200 rounded-md focus:outline-hidden focus:border-zinc-400"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
        {filtered.map((file) => {
          const originalIndex = files.findIndex((f) => f.path === file.path);
          const isActive = originalIndex === activeIndex;
          const isSelected = selectedPaths.has(file.path);
          const fileName = file.path.split('/').pop() || file.path;

          return (
            <div
              key={file.path}
              className={`flex items-center rounded-md border text-[10px] font-mono transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border-zinc-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onTogglePath(file.path)}
                className="pl-2 pr-1 py-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
                title={isSelected ? 'Hapus dari daftar push' : 'Sertakan dalam push'}
              >
                {isSelected ? (
                  <CheckSquare className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Square className="w-3 h-3 text-zinc-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onSelectIndex(originalIndex)}
                className="flex items-center gap-1 pr-2 py-1 cursor-pointer truncate max-w-[170px]"
                title={file.path}
              >
                <FileCode className={`w-3 h-3 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span className="truncate">{fileName}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
