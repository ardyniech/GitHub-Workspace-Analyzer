import React from 'react';
import { CommitDetail } from '../storage/commitApi';
import { ExternalLink, Plus, Minus, User } from 'lucide-react';

interface CommitDetailBannerProps {
  detail: CommitDetail;
}

export function CommitDetailBanner({ detail }: CommitDetailBannerProps) {
  const author = detail.author;
  const authorName = author?.login || detail.commit.author.name || 'Kontributor';

  return (
    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {author?.avatar_url ? (
            <img src={author.avatar_url} alt={authorName} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center">
              <User className="w-3 h-3 text-zinc-600" />
            </div>
          )}
          <span className="text-xs font-bold text-zinc-800 truncate">{authorName}</span>
        </div>
        <a
          href={detail.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[10px] font-semibold text-zinc-600 hover:text-zinc-900 underline"
        >
          <span>Buka di GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <p className="text-xs text-zinc-700 font-medium whitespace-pre-wrap">{detail.commit.message}</p>

      {detail.stats && (
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/60 text-[10.5px]">
          <span className="text-zinc-500">{detail.files?.length || 0} berkas diubah:</span>
          <span className="flex items-center text-emerald-600 font-bold">
            <Plus className="w-3 h-3" />{detail.stats.additions}
          </span>
          <span className="flex items-center text-rose-600 font-bold">
            <Minus className="w-3 h-3" />{detail.stats.deletions}
          </span>
        </div>
      )}
    </div>
  );
}
