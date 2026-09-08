import React from 'react';
import { usePr } from '../logic/usePr';
import { Badge } from '../../../shared/atoms/Badge';
import { Button } from '../../../shared/atoms/Button';
import { Loading } from '../../../shared/atoms/Loading';
import { usePeerReview, PeerReviewModal } from '../../peerReview';
import { GitPullRequest, AlertCircle, Sparkles } from 'lucide-react';

interface PrListProps {
  repoFullName: string;
}

export function PrList({ repoFullName }: PrListProps) {
  const { prs, loading, error } = usePr(repoFullName);
  const { report, reviewing, reviewPullRequest, clearReport } = usePeerReview(repoFullName);

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
    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
      {reviewing && <Loading message="AI Peer Reviewer sedang menganalisis perubahan kode PR..." />}

      {prs.length > 0 ? (
        prs.map((pr) => {
          const prState = getPrStateInfo(pr);
          return (
            <div
              key={pr.id}
              className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-col gap-2 hover:bg-zinc-100/50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2.5">
                <span className="font-semibold text-zinc-900 text-xs leading-snug line-clamp-2 flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  #{pr.number} {pr.title}
                </span>
                <Badge variant={prState.variant}>{prState.label}</Badge>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-zinc-500 border-t border-zinc-200/60 pt-2">
                <div className="flex items-center gap-1.5">
                  <img
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    className="w-3.5 h-3.5 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-medium text-zinc-700">{pr.user.login}</span>
                  <span>•</span>
                  <span>{new Date(pr.created_at).toLocaleDateString('id-ID')}</span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => reviewPullRequest(pr.number)}
                  disabled={reviewing}
                  icon={<Sparkles className="w-3 h-3 text-purple-600" />}
                  className="h-6 text-[10px] px-2 font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
                >
                  AI Review
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-xs text-zinc-400 py-6">Tidak ada pull request di repositori ini.</p>
      )}

      {report && (
        <PeerReviewModal report={report} onClose={clearReport} />
      )}
    </div>
  );
}
