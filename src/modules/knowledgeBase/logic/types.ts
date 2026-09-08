import { StyleRule } from '../../autoImprovement/logic/types';

export type RuleStatus = 'active' | 'overridden' | 'disabled' | 'custom';

export interface ExtendedStyleRule extends StyleRule {
  status?: RuleStatus;
  overrideNote?: string;
  updatedBy?: 'ai' | 'developer';
  lastModified?: string;
}

export interface KnowledgeBaseFilter {
  category: string;
  searchQuery: string;
  statusFilter: string;
}
