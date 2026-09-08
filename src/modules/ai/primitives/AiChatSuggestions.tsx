import React, { useState, useEffect } from 'react';
import { generateDynamicPrompts, executePromptWithScoring, DynamicPromptItem } from '../logic/promptGenerator';
import { ArrowUpRight, GitPullRequest, RefreshCw, Wand2, TrendingUp } from 'lucide-react';

interface AiChatSuggestionsProps {
  repoFullName: string | undefined;
  onSelect: (text: string) => void;
  onGeneratePrDraft: () => void;
  disabled: boolean;
}

export function AiChatSuggestions({ repoFullName, onSelect, onGeneratePrDraft, disabled }: AiChatSuggestionsProps) {
  const [prompts, setPrompts] = useState<DynamicPromptItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const refreshPrompts = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPrompts(generateDynamicPrompts(repoFullName));
      setIsGenerating(false);
    }, 250);
  };

  useEffect(() => {
    setPrompts(generateDynamicPrompts(repoFullName));
  }, [repoFullName]);

  const handlePromptClick = (s: DynamicPromptItem) => {
    executePromptWithScoring(s, onSelect);
    refreshPrompts();
  };

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-purple-600" />
          <span>Auto-Generated Prompts (Skor Efektivitas Real-time):</span>
        </span>
        <button
          type="button"
          onClick={refreshPrompts}
          disabled={disabled || isGenerating}
          className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin text-purple-600' : ''}`} />
          <span>Sintesis Prompt Baru</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onGeneratePrDraft}
          disabled={disabled}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-bold border rounded-full transition-all duration-150 text-left cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs"
        >
          <GitPullRequest className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>🚀 Buat Draft PR (Auto Scan & Commit)</span>
        </button>

        {prompts.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handlePromptClick(s)}
            disabled={disabled}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium border rounded-full transition-all duration-150 text-left cursor-pointer ${
              s.highlight
                ? 'bg-purple-100/80 hover:bg-purple-200/80 border-purple-300 text-purple-950 font-bold shadow-xs'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900 font-semibold'
            }`}
          >
            <span>{s.label}</span>
            <span className="text-[8.5px] font-bold px-1 rounded bg-purple-200/60 text-purple-900">
              {s.effectivenessScore}%
            </span>
            <ArrowUpRight className="w-2.5 h-2.5 shrink-0 text-purple-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
