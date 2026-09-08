import { runPreCommitTests } from '../logic/preCommitRunner';

export function runPreCommitRunnerTests(): boolean {
  console.log('[Module:Tester] Running Pre-Commit Test Runner Unit Tests...');

  // Test 1: Clean code (Happy Path)
  const cleanFiles = [
    { path: 'src/utils.ts', content: 'export function add(a: number, b: number) { return a + b; }' },
    { path: 'package.json', content: '{"name": "test-app", "version": "1.0.0"}' },
  ];
  const rep1 = runPreCommitTests(cleanFiles);
  if (!rep1.passed || rep1.passedTests !== rep1.totalTests) {
    console.error('[Module:Tester] Test 1 Failed: Clean files should pass all tests');
    return false;
  }
  console.log('[Module:Tester] Test 1 Passed: Clean files passed all 4 pre-commit tests');

  // Test 2: Unbalanced brackets (Syntax Error)
  const brokenFiles = [
    { path: 'src/broken.ts', content: 'export function broken() { if (true) { return 1; ' }, // missing }
  ];
  const rep2 = runPreCommitTests(brokenFiles);
  const syntaxTest = rep2.items.find((i) => i.id === 'test-syntax');
  if (syntaxTest?.passed !== false || rep2.passed !== false) {
    console.error('[Module:Tester] Test 2 Failed: Unbalanced syntax should fail');
    return false;
  }
  console.log('[Module:Tester] Test 2 Passed: Syntax error caught properly');

  // Test 3: Secret leak detected
  const leakFiles = [
    { path: 'src/config.ts', content: 'export const token = "ghp_123456789012345678901234567890";' },
  ];
  const rep3 = runPreCommitTests(leakFiles);
  const secretTest = rep3.items.find((i) => i.id === 'test-secrets');
  if (secretTest?.passed !== false || rep3.passed !== false) {
    console.error('[Module:Tester] Test 3 Failed: Secret leak must be flagged');
    return false;
  }
  console.log('[Module:Tester] Test 3 Passed: Secret leak detected and blocked');

  // Test 4: Placeholder warning
  const placeholderFiles = [
    { path: 'src/todo.ts', content: '// TODO: implement feature later\nexport const x = 1;' },
  ];
  const rep4 = runPreCommitTests(placeholderFiles);
  const phTest = rep4.items.find((i) => i.id === 'test-placeholder');
  if (phTest?.passed !== false) {
    console.error('[Module:Tester] Test 4 Failed: Placeholder should be flagged');
    return false;
  }
  console.log('[Module:Tester] Test 4 Passed: Placeholder caught properly');

  return true;
}
