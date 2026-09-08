export { RepoRecommendationWidget } from './primitives/RepoRecommendationWidget';
export { RepoRecommendationModal } from './primitives/RepoRecommendationModal';
export { QuickActionGrid } from './primitives/QuickActionGrid';
export { RecommendationCard } from './primitives/RecommendationCard';
export { useRepoRecommendation } from './logic/useRepoRecommendation';
export { generateRepoRecommendations, BASE_QUICK_ACTIONS } from './logic/recommendationEngine';
export type {
  RepoRecommendation,
  QuickActionItem,
  RepoRecommendationStats,
  RecommendationCategory,
  RecommendationImpact,
} from './logic/types';
