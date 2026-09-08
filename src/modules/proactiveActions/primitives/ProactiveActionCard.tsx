import React from 'react';
import { ProactiveActionItem } from '../logic/types';
import { CheckCircle2, Sparkles, FileCode } from 'lucide-react';

interface ProactiveActionCardProps {
  key?: React.Key;
  action: ProactiveActionItem;
  onVerify: (id: string) => void;
  onLearn: (id: string) => void;
}

export function ProactiveActionCard({ action, onVerify, onLearn }: ProactiveActionCardProps) {
  const isHighImpact = action.impactLevel === 'high';

  return (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-bold text-xs text-zinc-900 truncate">{action.title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${isHighImpact ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
            {action.impactLevel} Impact
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>{action.verificationStatus}</span>
          </span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">{action.description}</p>

      <div className="p-2 bg-purple-50/60 rounded-lg border border-purple-100 text-[10.5px] text-purple-950 leading-normal">
        <span className="font-bold">Rasionalitas Otonom: </span>
        <span>{action.rationale}</span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[10px] text-zinc-500">
        <div className="flex items-center gap-1 min-w-0 text-zinc-600 font-mono">
          <FileCode className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="truncate">{action.filesAffected.join(', ')}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {action.verificationStatus !== 'verified' && (
            <button
              onClick={() => onVerify(action.id)}
              className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-[9.5px] transition-all cursor-pointer"
            >
              Verifikasi
            </button>
          )}
          {action.verificationStatus !== 'learned' && (
            <button
              onClick={() => onLearn(action.id)}
              className="px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded text-[9.5px] transition-all cursor-pointer"
            >
              Pelajari
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
