import React from 'react';
import { SentimentResult } from '../logic/sentimentTypes';
import { IssueComment } from '../storage/commentApi';
import { SentimentSummaryCard } from './SentimentSummaryCard';
import { IssueCommentSentimentList } from './IssueCommentSentimentList';
import { AlertCircle } from 'lucide-react';

interface IssueSentimentSectionProps {
  issueNumber: number;
  comments: IssueComment[];
  analysis: SentimentResult | null;
  loading: boolean;
  error: string;
  onReload: () => void;
}

export function IssueSentimentSection({
  issueNumber,
  comments,
  analysis,
  loading,
  error,
  onReload,
}: IssueSentimentSectionProps) {
  if (error) {
    return (
      <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-zinc-200/80 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1">
      {analysis && (
        <SentimentSummaryCard
          analysis={analysis}
          loading={loading}
          onReload={onReload}
        />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Diskusi Tim ({comments.length} komentar):
        </span>
        <IssueCommentSentimentList
          comments={comments}
          analysis={analysis}
          loading={loading}
          issueNumber={issueNumber}
        />
      </div>
    </div>
  );
}
