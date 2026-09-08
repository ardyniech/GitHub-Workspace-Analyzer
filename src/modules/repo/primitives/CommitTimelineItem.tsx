import React from 'react';
import { CommitItem } from '../storage/commitApi';
import { ExternalLink, User, GitCompare } from 'lucide-react';

interface CommitTimelineItemProps {
  key?: React.Key;
  item: CommitItem;
  onViewDiff: () => void;
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

export function CommitTimelineItem({ item, onViewDiff }: CommitTimelineItemProps) {
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
        <p className="text-xs text-zinc-600 font-medium truncate" title={item.commit.message}>
          {message}
        </p>
      </div>
    </div>
  );
}
