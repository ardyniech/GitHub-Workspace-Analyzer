import React from 'react';
import { CommitItem } from '../storage/commitApi';
import { ExternalLink, User, GitCompare, Wand2, ShieldAlert } from 'lucide-react';
import { getFixItSuggestionsForCommit } from '../../prPreFlight/logic/fixItEngine';

interface CommitTimelineItemProps {
  key?: React.Key;
  item: CommitItem;
  onViewDiff: () => void;
  onRefactor?: () => void;
}

function formatCommitDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}j lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}h lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}

export function CommitTimelineItem({ item, onViewDiff, onRefactor }: CommitTimelineItemProps) {
  const author = item.author;
  const authorName = author?.login || item.commit.author.name || 'Kontributor';
  const message = item.commit.message.split('\n')[0];
  const shortSha = item.sha.substring(0, 7);

  return (
    <div className="relative flex items-start gap-3 pl-1 group">
      <div className="relative z-10 shrink-0">
        {author?.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={authorName}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-zinc-600 shadow-xs">
            <User className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 bg-zinc-50 hover:bg-zinc-100/80 transition-colors p-2 rounded-lg border border-zinc-200/60">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-semibold text-zinc-800 truncate">{authorName}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-zinc-400">{formatCommitDate(item.commit.author.date)}</span>
            {onRefactor && (
              <button
                type="button"
                onClick={onRefactor}
                title="Saran AI Refactor berdasarkan standar & memori agent"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-[9.5px] font-bold transition-colors cursor-pointer border border-purple-300"
              >
                <Wand2 className="w-2.5 h-2.5 text-purple-600" />
                <span>Refactor</span>
              </button>
            )}
            <button
              type="button"
              onClick={onViewDiff}
              title="Lihat perubahan kode (diff)"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white text-[9.5px] font-semibold transition-colors cursor-pointer"
            >
              <GitCompare className="w-2.5 h-2.5 text-emerald-400" />
              <span>Diff</span>
            </button>
            <a
              href={item.html_url}
              target="_blank"
              rel="noreferrer"
              title="Buka commit di GitHub"
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200/70 hover:bg-zinc-300 text-zinc-700 font-mono text-[9.5px] transition-colors"
            >
              <span>{shortSha}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
        <p className="text-xs text-zinc-600 font-medium truncate mb-1" title={item.commit.message}>
          {message}
        </p>

        {/* AI PR Pre-Flight 'Fix-It' suggestions */}
        {getFixItSuggestionsForCommit(item.sha, item.commit.message).map((fix) => (
          <div key={fix.id} className="mt-2 p-2 bg-amber-50/70 border border-amber-200 rounded-md text-[10px] flex flex-col gap-1">
            <div className="flex items-center gap-1 font-bold text-amber-800">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              <span>Saran Fix-It: Konflik {fix.ruleName}</span>
              <span className="text-[8px] uppercase bg-amber-100 text-amber-700 px-1 rounded ml-auto">
                {fix.severity}
              </span>
            </div>
            <p className="text-zinc-600 leading-normal font-medium">{fix.conflictMessage}</p>
            <div className="bg-white/80 p-1.5 rounded border border-amber-100 font-mono text-[9px] text-zinc-700 leading-normal mt-0.5">
              <span className="font-bold text-amber-900">Rekomendasi Solusi: </span>
              {fix.proposedFix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
