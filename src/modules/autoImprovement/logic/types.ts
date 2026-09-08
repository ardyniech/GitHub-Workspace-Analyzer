export interface StyleRule {
  id: string;
  category: 'architecture' | 'type_safety' | 'ui_ux' | 'error_handling' | 'performance';
  rule: string;
  rationale: string;
  impactScore: number; // 1 - 100
  originPr?: string;
  createdAt: string;
}

export interface PrReviewOutcome {
  prId: string;
  repoFullName: string;
  passScore: number;
  reviewerComments: string[];
  detectedFlaws: string[];
  suggestedRule?: string;
  reviewedAt: string;
}

export interface StyleGuideManifest {
  version: string;
  lastUpdated: string;
  totalImprovementCycles: number;
  rules: StyleRule[];
}
