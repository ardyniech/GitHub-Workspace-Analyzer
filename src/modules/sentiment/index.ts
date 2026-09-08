export { SentimentBadge } from './primitives/SentimentBadge';
export { SentimentSummaryCard } from './primitives/SentimentSummaryCard';
export { IssueCommentSentimentList } from './primitives/IssueCommentSentimentList';
export { IssueSentimentSection } from './primitives/IssueSentimentSection';
export { useIssueSentiment } from './logic/useIssueSentiment';
export { analyzeIssueComments, analyzeSingleText } from './logic/sentimentAnalyzer';
export { commentApi } from './storage/commentApi';
export type { IssueComment } from './storage/commentApi';
export type {
  DominantMood,
  CommentTone,
  SentimentResult,
  SentimentCounts,
  SentimentPercentages,
} from './logic/sentimentTypes';
