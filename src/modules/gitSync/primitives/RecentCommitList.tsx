import React, { useState } from 'react';
import { GitCommitInfo } from '../logic/types';
import { GitCommit, ChevronDown, ChevronUp, Clock, User } from 'lucide-react';

interface RecentCommitListProps {
  commits?: GitCommitInfo[];
}

export function RecentCommitList({ commits = [] }: RecentCommitListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!commits || commits.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between text-[10px] font-bold text-zinc-700 hover:text-zinc-900 cursor-pointer w-full"
      >
        <span className="flex items-center gap-1.5">
          <GitCommit className="w-3.5 h-3.5 text-indigo-600" />
          Riwayat Komit Lokal ({commits.length} komit)
        </span>
        <span className="text-[9px] text-zinc-400 flex items-center gap-1">
          {isExpanded ? 'Tutup' : 'Lihat'}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-zinc-200/60 max-h-36 overflow-y-auto">
          {commits.map((c) => (
            <div
              key={c.hash}
              className="p-1.5 bg-white border border-zinc-100 rounded-lg text-[9.5px] flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100 text-[8.5px]">
                  {c.hash}
                </span>
                <span className="text-[8.5px] text-zinc-400 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {c.relativeTime}
                </span>
              </div>
              <p className="text-zinc-800 font-medium truncate">{c.message}</p>
              <div className="flex items-center gap-1 text-[8px] text-zinc-400">
                <User className="w-2.5 h-2.5 text-zinc-300" />
                <span>{c.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
