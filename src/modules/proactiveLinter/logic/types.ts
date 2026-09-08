export type LintIssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type LintIssueCategory = 'performance' | 'security' | 'type_safety' | 'code_smell';
export type IssueStatus = 'open' | 'fixed' | 'ignored';

export interface LinterIssue {
  id: string;
  file: string;
  line?: number;
  category: LintIssueCategory;
  severity: LintIssueSeverity;
  ruleId: string;
  message: string;
  suggestion: string;
  snippet?: string;
  autoFixable: boolean;
  detectedAt: string;
  status: IssueStatus;
}

export interface LinterRunSummary {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  performanceCount: number;
  securityCount: number;
  filesScanned: number;
  lastScanTime: string;
  issues: LinterIssue[];
}
