export type RelevanceCategory = 'core_logic' | 'ui_layout' | 'config' | 'schema' | 'docs';

export interface FileWeightItem {
  path: string;
  weightPct: number;
  tokenCount: number;
  category: RelevanceCategory;
  relevanceReason: string;
}

export interface SemanticContextSummary {
  repoFullName: string;
  totalContextTokens: number;
  maxContextTokens: number;
  topCategory: RelevanceCategory;
  primaryFocus: string;
  reasoningOverview: string;
  files: FileWeightItem[];
}
