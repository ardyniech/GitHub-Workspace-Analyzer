import { securityScanner } from '../storage/securityScanner';

export function runSecurityScannerTests(): boolean {
  let passed = true;

  const assert = (condition: boolean, testName: string) => {
    if (!condition) {
      console.error(`[Module:security] Test failed: ${testName}`);
      passed = false;
    } else {
      console.log(`[Module:security] Test passed: ${testName}`);
    }
  };

  try {
    // 1. Happy path: safe clean code
    const cleanReport = securityScanner.scanContent(
      'export const sum = (a: number, b: number) => a + b;',
      'src/math.ts'
    );
    assert(cleanReport.isSafe === true, 'Clean code should be marked safe');
    assert(cleanReport.hasCritical === false, 'Clean code should have no critical issues');

    // 2. Secret leak path: Gemini API Key
    const leakReport = securityScanner.scanContent(
      'const key = "AIzaSyD-1234567890abcdefghijklmnopqrstuv";',
      'src/config.ts'
    );
    assert(leakReport.isSafe === false, 'Exposed API key should be detected');
    assert(leakReport.hasCritical === true, 'Exposed API key must have critical severity');
    assert(
      leakReport.findings.some((f) => f.type === 'secret_leak'),
      'Finding type should be secret_leak'
    );

    // 3. Risky dependency path: wildcard or deprecated package
    const pkgContent = JSON.stringify({
      dependencies: {
        request: '^2.88.2',
        lodash: '*',
      },
    });
    const depReport = securityScanner.scanContent(pkgContent, 'package.json');
    assert(depReport.isSafe === false, 'Risky dependencies should be detected');
    assert(
      depReport.findings.some((f) => f.type === 'vulnerable_dep'),
      'Finding should include vulnerable_dep'
    );

    // 4. Insecure code path: eval()
    const evalReport = securityScanner.scanContent('eval("2 + 2")', 'src/calc.js');
    assert(evalReport.hasCritical === true, 'eval() should trigger critical severity');
  } catch (err: any) {
    console.error(`[Module:security] Error in runSecurityScannerTests: ${err.message || err}`);
    return false;
  }

  return passed;
}
