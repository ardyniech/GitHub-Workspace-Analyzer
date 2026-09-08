export type ReviewSeverity = 'critical' | 'warning' | 'suggestion' | 'praise';
export type ReviewCategory = 'logic_bug' | 'redundancy' | 'style_convention' | 'security_flaw';

export interface PeerReviewFinding {
  id: string;
  category: ReviewCategory;
  severity: ReviewSeverity;
  title: string;
  description: string;
  lineNumber?: number;
  snippet?: string;
  suggestion?: string;
}

export interface PeerReviewReport {
  id: string;
  title: string;
  targetType: 'pull_request' | 'file_edit' | 'diff';
  targetIdentifier: string; // e.g. "PR #12" or "src/App.tsx"
  overallStatus: 'approved' | 'changes_requested' | 'commented';
  score: number; // 0 to 100
  summary: string;
  findings: PeerReviewFinding[];
  timestamp: number;
}
