export type ActionCategory = 'type_safety' | 'performance' | 'security' | 'architecture' | 'ergonomics';

export interface ProactiveActionItem {
  id: string;
  timestamp: string;
  category: ActionCategory;
  title: string;
  description: string;
  rationale: string;
  filesAffected: string[];
  verificationStatus: 'verified' | 'pending' | 'learned';
  impactLevel: 'high' | 'medium' | 'low';
}

export interface ProactiveSummary {
  totalActions: number;
  verifiedCount: number;
  learnedCount: number;
  highImpactCount: number;
}
