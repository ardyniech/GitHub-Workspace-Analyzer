import React from 'react';

interface VoiceSuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function VoiceSuggestionChips({ suggestions, onSelect }: VoiceSuggestionChipsProps) {
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Coba katakan salah satu:</span>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10.5px] font-medium transition-colors cursor-pointer"
          >
            🎙️ {s}
          </button>
        ))}
      </div>
    </div>
  );
}
