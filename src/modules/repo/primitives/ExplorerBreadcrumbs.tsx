import React from 'react';
import { ChevronRight, CornerDownLeft, FilePlus } from 'lucide-react';

interface ExplorerBreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onNavigateUp: () => void;
  onNewFile: () => void;
}

export function ExplorerBreadcrumbs({
  currentPath,
  onNavigate,
  onNavigateUp,
  onNewFile,
}: ExplorerBreadcrumbsProps) {
  const parts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-100 rounded-lg text-xs text-zinc-600 font-mono">
      <div className="flex items-center gap-1 overflow-x-auto">
        <span
          className="cursor-pointer hover:underline text-zinc-900 font-bold"
          onClick={() => onNavigate('')}
        >
          root
        </span>
        {parts.map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <span
              className="cursor-pointer hover:underline text-zinc-800"
              onClick={() => onNavigate(parts.slice(0, idx + 1).join('/'))}
            >
              {seg}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onNewFile}
          className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/80 px-2 py-0.5 rounded cursor-pointer transition-colors"
        >
          <FilePlus className="w-3 h-3" />
          <span>+ Berkas Baru</span>
        </button>
        {currentPath && (
          <button
            type="button"
            onClick={onNavigateUp}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            <CornerDownLeft className="w-3 h-3" />
            <span>Kembali</span>
          </button>
        )}
      </div>
    </div>
  );
}
