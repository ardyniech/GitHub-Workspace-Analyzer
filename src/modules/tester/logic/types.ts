export interface PreCommitTestItem {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  severity: 'error' | 'warning';
  message?: string;
  failedFiles?: string[];
}

export interface PreCommitReport {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  items: PreCommitTestItem[];
  durationMs: number;
}
