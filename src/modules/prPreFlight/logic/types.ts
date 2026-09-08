export type PreFlightStatus = 'pending' | 'scanning' | 'passed' | 'failed';

export interface PreFlightFileReview {
  filePath: string;
  linesChanged: number;
  status: 'passed' | 'failed' | 'warning';
  issuesCount: number;
}

export interface PreFlightIssue {
  id: string;
  filePath: string;
  ruleId: string;
  ruleName: string;
  severity: 'critical' | 'warning' | 'architectural';
  message: string;
  proposedFix: string;
}

export interface PreFlightState {
  status: PreFlightStatus;
  commitHash: string;
  commitMessage: string;
  score: number; // 0 to 100
  filesReviewed: PreFlightFileReview[];
  issues: PreFlightIssue[];
  startedAt: string;
}
