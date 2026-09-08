import React from 'react';
import { CommitSnapshot } from '../logic/types';
import { History, RotateCcw, ShieldCheck, User } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';

interface CommitTimelineSnapshotProps {
  commit: CommitSnapshot;
  isLatest: boolean;
  isOperating: boolean;
  isCurrentRollingBack: boolean;
  onRollback: (hash: string) => void;
}

export function CommitTimelineSnapshot({
  commit,
  isLatest,
  isOperating,
  isCurrentRollingBack,
  onRollback,
}: CommitTimelineSnapshotProps) {
  return (
    <div
      className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
        isLatest
          ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
          : commit.isRestorePoint
          ? 'bg-emerald-50/40 border-emerald-200'
          : 'bg-white border-zinc-200 hover:border-zinc-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {commit.hash}
          </span>
          {isLatest && (
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-full">
              Versi Aktif (HEAD)
            </span>
          )}
          {commit.isRestorePoint && (
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Titik Pemulihan
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-500 font-medium">{commit.relativeTime}</span>
      </div>

      <p className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-relaxed">
        {commit.message}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-zinc-100/80 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3 text-zinc-400" /> {commit.author || 'AI Agent'}
        </span>

        {!isLatest && (
          <Button
            size="sm"
            onClick={() => onRollback(commit.hash)}
            disabled={isOperating}
            icon={<RotateCcw className={`w-3 h-3 ${isCurrentRollingBack ? 'animate-spin' : ''}`} />}
            className="h-6 text-[9.5px] font-bold bg-zinc-900 hover:bg-black text-white px-2.5 rounded-lg shadow-2xs"
          >
            {isCurrentRollingBack ? 'Memulihkan...' : 'Kembalikan Versi Ini'}
          </Button>
        )}
      </div>
    </div>
  );
}
