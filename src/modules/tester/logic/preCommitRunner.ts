import { PreCommitReport, PreCommitTestItem } from './types';
import { testSanityAndEmpty, testPlaceholderAndIncomplete, testSyntaxAndBrackets } from './syntaxValidators';
import { testSecretsAndCredentials, testTypoAndDuplicateImports, testFileLengthCompliance } from './codeQualityValidators';

export * from './types';

export function runPreCommitTests(files: Array<{ path: string; content: string }>): PreCommitReport {
  const start = performance.now();
  const items: PreCommitTestItem[] = [
    testSanityAndEmpty(files),
    testPlaceholderAndIncomplete(files),
    testSyntaxAndBrackets(files),
    testSecretsAndCredentials(files),
    testTypoAndDuplicateImports(files),
    testFileLengthCompliance(files),
  ];

  const passedCount = items.filter((i) => i.passed).length;
  const criticalFails = items.filter((i) => !i.passed && i.severity === 'error').length;

  return {
    passed: criticalFails === 0,
    totalTests: items.length,
    passedTests: passedCount,
    failedTests: items.length - passedCount,
    items,
    durationMs: Math.round(performance.now() - start),
  };
}
