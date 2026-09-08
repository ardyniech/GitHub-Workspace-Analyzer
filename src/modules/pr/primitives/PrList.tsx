import React from 'react';
import { usePr } from '../logic/usePr';
import { Badge } from '../../../shared/atoms/Badge';
import { Loading } from '../../../shared/atoms/Loading';
import { GitPullRequest, AlertCircle } from 'lucide-react';

interface PrListProps {
  repoFullName: string;
}

export function PrList({ repoFullName }: PrListProps) {
  const { prs, loading, error } = usePr(repoFullName);

  if (loading) return <Loading message="Mengambil list pull request..." />;

  if (error) {
    return (
      <div className="flex items-center gap-1.5 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  const getPrStateInfo = (pr: any) => {
    if (pr.merged_at) return { label: 'Merged', variant: 'success' as const };
    if (pr.state === 'closed') return { label: 'Closed', variant: 'error' as const };
    return { label: 'Open', variant: 'warning' as const };
  };

  return (
    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
      {prs.length > 0 ? (
        prs.map((pr) => {
          const prState = getPrStateInfo(pr);
          return (
            <div
              key={pr.id}
              className="p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex flex-col gap-1.5 hover:bg-zinc-100/50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2.5">
                <span className="font-semibold text-zinc-800 text-xs leading-snug line-clamp-2 flex items-center gap-1">
                  <GitPullRequest className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  #{pr.number} {pr.title}
                </span>
                <Badge variant={prState.variant}>{prState.label}</Badge>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <div className="flex items-center gap-1">
                  <img
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    className="w-3.5 h-3.5 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-medium">{pr.user.login}</span>
                </div>
                <span>{new Date(pr.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-xs text-zinc-400 py-6">Tidak ada pull request di repositori ini.</p>
      )}
    </div>
  );
}
