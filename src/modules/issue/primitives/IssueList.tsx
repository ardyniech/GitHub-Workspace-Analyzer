import React from 'react';
import { useIssue } from '../logic/useIssue';
import { Loading } from '../../../shared/atoms/Loading';
import { AlertCircle } from 'lucide-react';
import { IssueLabelDistribution } from './IssueLabelDistribution';
import { IssueItem } from './IssueItem';

interface IssueListProps {
  repoFullName: string;
}

export function IssueList({ repoFullName }: IssueListProps) {
  const { issues, loading, error } = useIssue(repoFullName);

  if (loading) return <Loading message="Mengambil list issue..." />;

  if (error) {
    return (
      <div className="flex items-center gap-1.5 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  const openIssues = issues.filter((issue) => issue.state === 'open');

  return (
    <div className="flex flex-col gap-3">
      {/* Label Distribution Bar Chart (Open Issues) */}
      <IssueLabelDistribution openIssues={openIssues} />

      {/* Issues List Container */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueItem key={issue.id} issue={issue} repoFullName={repoFullName} />
          ))
        ) : (
          <p className="text-center text-xs text-zinc-400 py-6">
            Tidak ada issue aktif di repositori ini.
          </p>
        )}
      </div>
    </div>
  );
}
