import React from 'react';
import { LinterIssue } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { ShieldAlert, Zap, CheckCircle2, EyeOff, Wrench, FileCode } from 'lucide-react';

interface LinterIssueCardProps {
  key?: React.Key;
  issue: LinterIssue;
  onFix: (id: string) => void;
  onIgnore: (id: string) => void;
}

export function LinterIssueCard({ issue, onFix, onIgnore }: LinterIssueCardProps) {
  const isSecurity = issue.category === 'security';
  const isCritical = issue.severity === 'critical';

  return (
    <div className={`p-3 rounded-xl border transition-all ${
      issue.status === 'fixed'
        ? 'bg-emerald-50/60 border-emerald-200 opacity-60'
        : issue.status === 'ignored'
        ? 'bg-zinc-100/60 border-zinc-200 opacity-50'
        : isCritical
        ? 'bg-red-50/70 border-red-200 hover:border-red-300'
        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isSecurity ? (
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <div className="flex items-center gap-1 min-w-0 font-mono text-[11px] font-bold text-zinc-900">
            <FileCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{issue.file}</span>
            {issue.line && <span className="text-zinc-500">:{issue.line}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
            isCritical
              ? 'bg-red-100 text-red-800 border-red-300'
              : issue.severity === 'high'
              ? 'bg-orange-100 text-orange-800 border-orange-300'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            {issue.severity}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 capitalize">
            {issue.category}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-800 font-semibold mt-1.5 leading-snug">{issue.message}</p>

      {issue.snippet && (
        <div className="my-1.5 p-1.5 bg-zinc-900 text-emerald-400 font-mono text-[10px] rounded border border-zinc-800 overflow-x-auto">
          <code>{issue.snippet}</code>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[10px]">
        <span className="text-zinc-600 font-medium italic">Saran: {issue.suggestion}</span>

        {issue.status === 'open' && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onIgnore(issue.id)}
              className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              title="Abaikan Isu Ini"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
            {issue.autoFixable && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onFix(issue.id)}
                icon={<Wrench className="w-3 h-3" />}
                className="h-5 text-[9.5px] font-bold bg-indigo-700 hover:bg-indigo-800 text-white"
              >
                Auto-Fix
              </Button>
            )}
          </div>
        )}

        {issue.status === 'fixed' && (
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Terperbaiki
          </span>
        )}
      </div>
    </div>
  );
}
