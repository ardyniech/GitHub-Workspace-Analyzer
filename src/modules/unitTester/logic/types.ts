export interface TestCaseResult {
  id: string;
  testName: string;
  filePath: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs: number;
  errorMessage?: string;
}

export interface TestSuiteSummary {
  totalTests: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  coveragePercentage: number;
  results: TestCaseResult[];
}
