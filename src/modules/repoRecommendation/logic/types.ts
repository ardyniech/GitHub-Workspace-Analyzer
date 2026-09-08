export type RecommendationCategory =
  | 'architecture'
  | 'security'
  | 'cicd'
  | 'testing'
  | 'documentation'
  | 'performance';

export type RecommendationImpact = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationEffort = 'quick' | 'moderate' | 'deep';
export type RecommendationStatus = 'idle' | 'executing' | 'completed' | 'dismissed';

export interface RepoRecommendation {
  id: string;
  title: string;
  category: RecommendationCategory;
  impact: RecommendationImpact;
  effort: RecommendationEffort;
  description: string;
  humanReason: string;
  suggestedPrompt: string;
  quickActionLabel: string;
  badgeText: string;
  status: RecommendationStatus;
  executionProgress?: number;
  lastExecutedAt?: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  sublabel: string;
  category: RecommendationCategory;
  iconName: 'ShieldAlert' | 'Workflow' | 'FlaskConical' | 'Split' | 'BookOpen' | 'Zap';
  prompt: string;
  colorClass: string;
}

export interface RepoRecommendationStats {
  total: number;
  completed: number;
  criticalCount: number;
  readinessScore: number;
}
