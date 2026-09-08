import React from 'react';
import { IssueComment } from '../storage/commentApi';
import { SentimentResult } from '../logic/sentimentTypes';
import { ExternalLink, MessageCircle } from 'lucide-react';

interface IssueCommentSentimentListProps {
  comments: IssueComment[];
  analysis: SentimentResult | null;
  loading: boolean;
  issueNumber: number;
}

export function IssueCommentSentimentList({
  comments,
  analysis,
  loading,
  issueNumber,
}: IssueCommentSentimentListProps) {
  if (loading) {
    return (
      <div className="p-3 text-center text-xs text-zinc-400 animate-pulse bg-zinc-50 rounded-lg border border-zinc-100">
        Memuat komentar & memindai nuansa emosional...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="p-3 text-center text-xs text-zinc-500 bg-zinc-50 rounded-lg border border-zinc-150 flex items-center justify-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
        <span>Belum ada komentar tim di issue #{issueNumber}.</span>
      </div>
    );
  }

  const tonesMap = new Map(analysis?.commentTones.map((t) => [t.id, t]));

  return (
    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
      {comments.map((comment) => {
        const tone = tonesMap.get(comment.id);
        return (
          <div
            key={comment.id}
            className="p-2.5 bg-white border border-zinc-150 rounded-lg flex flex-col gap-1.5 shadow-2xs hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={comment.user.avatar_url}
                  alt={comment.user.login}
                  className="w-4 h-4 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10.5px] font-semibold text-zinc-700 truncate">
                  {comment.user.login}
                </span>
                <span className="text-[9.5px] text-zinc-400">
                  {new Date(comment.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              {tone && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200"
                  title={`Skor emosi: ${tone.score}`}
                >
                  <span>{tone.emoji}</span>
                  <span>{tone.label}</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-600 line-clamp-3 whitespace-pre-wrap">
              {comment.body}
            </p>

            {comment.html_url && (
              <div className="flex justify-end pt-1">
                <a
                  href={comment.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-zinc-400 hover:text-zinc-700 inline-flex items-center gap-0.5"
                >
                  <span>Buka di GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
