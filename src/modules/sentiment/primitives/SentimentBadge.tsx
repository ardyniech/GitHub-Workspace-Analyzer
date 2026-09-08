import React from 'react';
import { MessageSquare } from 'lucide-react';
import { DominantMood } from '../logic/sentimentTypes';

interface SentimentBadgeProps {
  commentCount: number;
  mood?: DominantMood;
  label?: string;
  emoji?: string;
  loading?: boolean;
  onClick?: () => void;
  isOpen?: boolean;
}

export function SentimentBadge({
  commentCount,
  mood = 'neutral',
  label,
  emoji,
  loading = false,
  onClick,
  isOpen = false,
}: SentimentBadgeProps) {
  const moodStyles = {
    positive: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
    critical: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
    inquiry: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100',
    neutral: 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100',
  }[mood];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold border transition-all duration-150 cursor-pointer select-none after:absolute after:-inset-2 after:content-[''] ${moodStyles} ${
        isOpen ? 'ring-1 ring-zinc-400' : ''
      }`}
      title={label ? `Nuansa: ${label} (${commentCount} komentar)` : 'Buka analisis sentimen'}
    >
      <MessageSquare className="w-3 h-3 shrink-0 text-zinc-500" />
      <span>{commentCount}</span>

      {loading ? (
        <span className="text-[10px] text-zinc-400 animate-pulse">Analisis...</span>
      ) : commentCount > 0 && label ? (
        <span className="flex items-center gap-1 border-l border-zinc-300/80 pl-1.5">
          <span>{emoji}</span>
          <span className="font-bold">{label}</span>
        </span>
      ) : null}
    </button>
  );
}
