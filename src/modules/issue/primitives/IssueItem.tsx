import React from 'react';
import { Issue } from '../storage/api';
import { Badge } from '../../../shared/atoms/Badge';
import { useAuth } from '../../auth';
import { SentimentBadge, IssueSentimentSection, useIssueSentiment } from '../../sentiment';

interface IssueItemProps {
  key?: React.Key;
  issue: Issue;
  repoFullName: string;
}

export function IssueItem({ issue, repoFullName }: IssueItemProps) {
  const { token } = useAuth();
  const commentCount = issue.comments ?? 0;

  const {
    comments,
    analysis,
    loading,
    error,
    isExpanded,
    toggleExpand,
    reload,
  } = useIssueSentiment(repoFullName, issue.number, commentCount, token);

  return (
    <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex flex-col gap-1.5 hover:bg-zinc-100/50 transition-colors duration-150">
      <div className="flex items-start justify-between gap-2.5">
        <span className="font-semibold text-zinc-800 text-xs leading-snug line-clamp-2">
          #{issue.number} {issue.title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={issue.state === 'open' ? 'warning' : 'success'}>
            {issue.state === 'open' ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </div>

      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {issue.labels.map((label) => (
            <span
              key={label.id}
              style={{
                backgroundColor: `#${label.color}1e`,
                color: `#${label.color}`,
                borderColor: `#${label.color}3f`,
              }}
              className="px-1.5 py-0.5 rounded text-[9px] font-semibold border"
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
        <div className="flex items-center gap-1">
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className="w-3.5 h-3.5 rounded-full"
            referrerPolicy="no-referrer"
          />
          <span className="font-medium">{issue.user.login}</span>
          <span className="text-zinc-300">•</span>
          <span>{new Date(issue.created_at).toLocaleDateString('id-ID')}</span>
        </div>

        {/* Kolom Komentar & Analisis Sentimen */}
        <SentimentBadge
          commentCount={commentCount}
          mood={analysis?.dominantMood}
          label={analysis?.label}
          emoji={analysis?.emoji}
          loading={loading}
          isOpen={isExpanded}
          onClick={toggleExpand}
        />
      </div>

      {/* Expanded Sentiment Summary & Discussion Breakdown */}
      {isExpanded && (
        <IssueSentimentSection
          issueNumber={issue.number}
          comments={comments}
          analysis={analysis}
          loading={loading}
          error={error}
          onReload={reload}
        />
      )}
    </div>
  );
}
