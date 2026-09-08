import React from 'react';
import { StyleDeltaRecord } from '../logic/types';
import { UserCheck, Sparkles } from 'lucide-react';

interface AuditDeltaCardProps {
  key?: React.Key;
  delta: StyleDeltaRecord;
}

export function AuditDeltaCard({ delta }: AuditDeltaCardProps) {
  const isOverride = delta.action === 'developer_override';
  const scoreDiff = delta.impactScoreAfter - delta.impactScoreBefore;

  return (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/90 hover:border-zinc-300 transition-all flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {isOverride ? (
            <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          )}
          <span className="font-bold text-xs text-zinc-900 truncate">{delta.ruleTitle}</span>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${isOverride ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>
          {isOverride ? 'Dev Override' : 'AI Evolution'}
        </span>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed">{delta.changeDescription}</p>

      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[10px] text-zinc-500">
        <span className="font-mono">{new Date(delta.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <div className="flex items-center gap-1.5 font-semibold">
          <span>Skor Dampak: {delta.impactScoreBefore}%</span>
          <span>→</span>
          <span className="text-emerald-700 font-bold">{delta.impactScoreAfter}%</span>
          {scoreDiff > 0 && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded font-bold">+{scoreDiff}%</span>}
        </div>
      </div>
    </div>
  );
}
