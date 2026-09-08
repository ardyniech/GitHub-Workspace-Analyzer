import { parseCopilotProposal } from '../logic/copilotProposalParser';

export function runProposalParserTests(): boolean {
  console.log('[Module:AI] Running Proposal Parser Unit Tests...');

  // Test 1: Single file format
  const singleFileJson = JSON.stringify({
    path: 'src/App.tsx',
    commitMessage: 'fix: typo in title',
    content: 'export default function App() {}',
  });
  const res1 = parseCopilotProposal(singleFileJson);
  if (!res1.isValid || res1.files.length !== 1 || res1.files[0].path !== 'src/App.tsx') {
    console.error('[Module:AI] Test 1 Failed: Single file format');
    return false;
  }
  console.log('[Module:AI] Test 1 Passed: Single file format correctly parsed');

  // Test 2: Multi-file object format
  const multiFileJson = JSON.stringify({
    commitMessage: 'feat: add multi-file authentication support',
    files: [
      { path: 'src/types.ts', content: 'export type User = { id: string };' },
      { path: 'src/components/Nav.tsx', content: 'export function Nav() {}' },
    ],
  });
  const res2 = parseCopilotProposal(multiFileJson);
  if (!res2.isValid || res2.files.length !== 2 || res2.files[1].path !== 'src/components/Nav.tsx') {
    console.error('[Module:AI] Test 2 Failed: Multi-file format');
    return false;
  }
  console.log('[Module:AI] Test 2 Passed: Multi-file format correctly parsed with 2 files');

  // Test 3: Array format
  const arrayJson = JSON.stringify([
    { path: 'src/file1.ts', content: 'const a = 1;' },
    { path: 'src/file2.ts', content: 'const b = 2;' },
  ]);
  const res3 = parseCopilotProposal(arrayJson);
  if (!res3.isValid || res3.files.length !== 2) {
    console.error('[Module:AI] Test 3 Failed: Array format');
    return false;
  }
  console.log('[Module:AI] Test 3 Passed: Array format correctly parsed');

  // Test 4: 30-file batch format
  const files30 = Array.from({ length: 30 }, (_, i) => ({
    path: `src/components/Component${i + 1}.tsx`,
    content: `export function Component${i + 1}() { return <div>${i + 1}</div>; }`,
  }));
  const batch30Json = JSON.stringify({
    commitMessage: 'feat: add 30 modular components',
    files: files30,
  });
  const res30 = parseCopilotProposal(batch30Json);
  if (!res30.isValid || res30.files.length !== 30 || res30.files[29].path !== 'src/components/Component30.tsx') {
    console.error('[Module:AI] Test 4 Failed: 30-file batch format');
    return false;
  }
  console.log('[Module:AI] Test 4 Passed: 30-file batch correctly parsed');

  // Test 5: Invalid/empty format
  const res5 = parseCopilotProposal('');
  if (res5.isValid || res5.files.length !== 0) {
    console.error('[Module:AI] Test 5 Failed: Invalid format should be marked false');
    return false;
  }
  console.log('[Module:AI] Test 5 Passed: Invalid format handled cleanly');

  return true;
}
