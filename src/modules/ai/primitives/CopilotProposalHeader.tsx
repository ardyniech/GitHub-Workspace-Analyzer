import React from 'react';
import { GitCommit, FileCode, Layers } from 'lucide-react';

interface CopilotProposalHeaderProps {
  path: string;
  commitMessage: string;
  fileCount?: number;
}

export function CopilotProposalHeader({
  path,
  commitMessage,
  fileCount = 1,
}: CopilotProposalHeaderProps) {
  const isMultiFile = fileCount > 1;

  return (
    <div className="flex flex-col">
      <div className="px-3.5 py-2 bg-zinc-900 text-white flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          {isMultiFile ? (
            <Layers className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : (
            <GitCommit className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
          <span className="font-bold text-[10px] tracking-wider uppercase">
            {isMultiFile
              ? `Copilot Multi-File Proposal (${fileCount} Berkas)`
              : 'Copilot Direct-Push Proposal'}
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold text-emerald-300 uppercase">
          Siap Diterapkan
        </span>
      </div>

      <div className="p-3 bg-zinc-50 border-b border-zinc-200 flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-600">
          <FileCode className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="font-semibold text-zinc-500">
            {isMultiFile ? 'Berkas Aktif:' : 'Berkas:'}
          </span>
          <code className="px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-900 font-mono font-bold text-[10.5px] truncate">
            {path}
          </code>
        </div>
        <div className="flex items-start gap-1.5 text-zinc-600">
          <GitCommit className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
          <p className="font-medium text-zinc-800 italic text-[11px] leading-snug">
            "{commitMessage || `Update ${path} via AI Copilot`}"
          </p>
        </div>
      </div>
    </div>
  );
}
