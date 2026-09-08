import React from 'react';
import { WorkflowRunItem } from '../logic/types';
import { formatDuration, formatTimeAgo } from '../logic/ciEngine';
import { CheckCircle2, XCircle, Clock, GitBranch, GitCommit, ExternalLink, RefreshCw } from 'lucide-react';

interface WorkflowRunCardProps {
  key?: React.Key;
  run: WorkflowRunItem;
  onReRun?: (id: number) => void;
}

export function WorkflowRunCard({ run, onReRun }: WorkflowRunCardProps) {
  const isSuccess = run.status === 'success' || run.conclusion === 'success';
  const isFailure = run.status === 'failure' || run.conclusion === 'failure';

  const getStatusBadge = () => {
    if (isSuccess) {
      return (
        <span className="flex items-center gap-1 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Lulus</span>
        </span>
      );
    }
    if (isFailure) {
      return (
        <span className="flex items-center gap-1 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200 shrink-0">
          <XCircle className="w-3 h-3 text-red-600" />
          <span>Gagal</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
        <span>Berjalan</span>
      </span>
    );
  };

  return (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img src={run.actor.avatarUrl} alt={run.actor.login} className="w-5 h-5 rounded-full border border-zinc-300 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-zinc-900 truncate">{run.name}</span>
            <span className="text-[10px] text-zinc-500 font-medium truncate">{run.workflowName}</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="p-2 bg-white rounded-lg border border-zinc-200/80 text-[10.5px] text-zinc-700 leading-snug">
        <span className="font-semibold">{run.commitMessage}</span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-200/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-700 font-semibold">
            <GitBranch className="w-3 h-3 text-indigo-600" /> {run.branch}
          </span>
          <span className="flex items-center gap-1 text-zinc-500">
            <GitCommit className="w-3 h-3 text-zinc-400" /> {run.commitSha}
          </span>
          <span className="text-zinc-400">{formatDuration(run.durationSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9.5px] text-zinc-400">{formatTimeAgo(run.createdAt)}</span>
          <a
            href={run.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-zinc-400 hover:text-indigo-600 transition-colors"
            title="Lihat Log GitHub Actions"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
