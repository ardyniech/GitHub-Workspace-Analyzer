import React from 'react';
import { RepoRecommendation } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { Play, CheckCircle2, X, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RepoRecommendation;
  onExecute: (rec: RepoRecommendation) => void;
  onDismiss: (id: string) => void;
  isExecuting: boolean;
}

const IMPACT_COLORS = {
  critical: 'bg-rose-100 text-rose-800 border-rose-200',
  high: 'bg-amber-100 text-amber-800 border-amber-200',
  medium: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  low: 'bg-zinc-100 text-zinc-700 border-zinc-200',
};

export function RecommendationCard({
  recommendation: rec,
  onExecute,
  onDismiss,
  isExecuting,
}: RecommendationCardProps) {
  const isCompleted = rec.status === 'completed';
  const isItemExecuting = rec.status === 'executing' || isExecuting;

  return (
    <div
      className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
        isCompleted
          ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
          : rec.impact === 'critical'
          ? 'bg-rose-50/30 border-rose-200 shadow-2xs'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
              IMPACT_COLORS[rec.impact]
            }`}
          >
            {rec.badgeText}
          </span>
          <span className="text-[9px] font-mono text-zinc-400 capitalize">
            • {rec.category}
          </span>
        </div>
        {!isCompleted && (
          <button
            type="button"
            onClick={() => onDismiss(rec.id)}
            title="Sembunyikan rekomendasi"
            className="text-zinc-300 hover:text-zinc-500 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div>
        <h4 className="text-[11px] font-bold text-zinc-900 leading-snug flex items-center gap-1">
          {rec.title}
        </h4>
        <p className="text-[9.5px] text-zinc-600 mt-1 leading-relaxed">
          {rec.description}
        </p>
        <div className="mt-1.5 p-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] text-zinc-500 flex items-start gap-1">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
          <span><strong>Dampak:</strong> {rec.humanReason}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-0.5">
        <div className="text-[9px] text-zinc-400 font-mono">
          Effort: <span className="text-zinc-600 font-semibold">{rec.effort}</span>
        </div>
        {isCompleted ? (
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
          </span>
        ) : (
          <Button
            size="sm"
            onClick={() => onExecute(rec)}
            disabled={isItemExecuting}
            icon={isItemExecuting ? <Sparkles className="w-3 h-3 animate-spin text-indigo-600" /> : <Play className="w-3 h-3 fill-current" />}
            className="h-6 text-[9.5px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 shadow-2xs"
          >
            {isItemExecuting ? 'Mengeksekusi...' : rec.quickActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
