import React from 'react';
import { SentimentResult } from '../logic/sentimentTypes';
import { RotateCw, Heart, AlertTriangle, HelpCircle, MessageSquare } from 'lucide-react';

interface SentimentSummaryCardProps {
  analysis: SentimentResult;
  loading: boolean;
  onReload: () => void;
}

export function SentimentSummaryCard({ analysis, loading, onReload }: SentimentSummaryCardProps) {
  const { label, emoji, summary, percentages, counts, totalComments } = analysis;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-3 flex flex-col gap-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-xs font-bold text-zinc-900">Nuansa Emosional: {label}</span>
        </div>
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="relative text-[10px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-zinc-100 transition-colors after:absolute after:-inset-2 after:content-['']"
          title="Segarkan analisis sentimen"
        >
          <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin text-zinc-600' : ''}`} />
          <span>{loading ? 'Memperbarui...' : 'Segarkan'}</span>
        </button>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-150 p-2 rounded-lg">
        {summary}
      </p>

      {/* Visual ratio bar */}
      {totalComments > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-100">
          <div className="h-1.5 w-full bg-zinc-150 rounded-full overflow-hidden flex">
            {percentages.positive > 0 && (
              <div
                style={{ width: `${percentages.positive}%` }}
                className="bg-emerald-500 h-full"
                title={`Positif: ${percentages.positive}%`}
              />
            )}
            {percentages.neutral > 0 && (
              <div
                style={{ width: `${percentages.neutral}%` }}
                className="bg-zinc-400 h-full"
                title={`Netral: ${percentages.neutral}%`}
              />
            )}
            {percentages.critical > 0 && (
              <div
                style={{ width: `${percentages.critical}%` }}
                className="bg-amber-500 h-full"
                title={`Kendala: ${percentages.critical}%`}
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[9.5px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <Heart className="w-2.5 h-2.5 text-emerald-500" />
              <span>{counts.positive} Positif ({percentages.positive}%)</span>
            </span>
            <span className="flex items-center gap-1 text-zinc-600">
              <MessageSquare className="w-2.5 h-2.5 text-zinc-400" />
              <span>{counts.neutral} Netral ({percentages.neutral}%)</span>
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
              <span>{counts.critical} Kendala ({percentages.critical}%)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
