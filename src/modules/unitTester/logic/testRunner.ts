import { TestCaseResult, TestSuiteSummary } from './types';

export function runAutomatedTests(repoFullName?: string): TestSuiteSummary {
  const mockCases: TestCaseResult[] = [
    { id: 't-1', testName: 'Core Loader registers all cellular modules', filePath: 'src/core/loader.ts', status: 'passed', durationMs: 12 },
    { id: 't-2', testName: 'Dispatcher emits and listens to custom events', filePath: 'src/core/dispatcher.ts', status: 'passed', durationMs: 18 },
    { id: 't-3', testName: 'Learning Engine upgrades confidence scores', filePath: 'src/modules/learning/logic/learningEngine.ts', status: 'passed', durationMs: 24 },
    { id: 't-4', testName: 'Memory Storage persists knowledge to localStorage', filePath: 'src/modules/memory/storage/memoryStorage.ts', status: 'passed', durationMs: 15 },
    { id: 't-5', testName: 'Performance Calculator handles empty trend data safely', filePath: 'src/modules/agentPerformance/storage/performanceStorage.ts', status: 'passed', durationMs: 8 },
    { id: 't-6', testName: 'Diff Calculator computes additions and deletions accurately', filePath: 'src/modules/diffViewer/logic/diffCalculator.ts', status: 'passed', durationMs: 19 },
  ];

  return {
    totalTests: mockCases.length,
    passedCount: mockCases.filter((c) => c.status === 'passed').length,
    failedCount: mockCases.filter((c) => c.status === 'failed').length,
    skippedCount: 0,
    coveragePercentage: 94.8,
    results: mockCases,
  };
}
