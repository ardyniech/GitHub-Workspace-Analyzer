import { buildPrDraft } from '../logic/prDraftBuilder';
import { CommitItem } from '../../repo';
import { SecurityFinding } from '../../security';

export function runPrDraftBuilderTests(): boolean {
  let passed = true;
  const assert = (cond: boolean, name: string) => {
    if (!cond) {
      console.error(`[Module:ai] Test failed: ${name}`);
      passed = false;
    } else {
      console.log(`[Module:ai] Test passed: ${name}`);
    }
  };

  try {
    // 1. Happy path: clean commits, clean scan
    const mockCommits: CommitItem[] = [
      {
        sha: 'abc1234567890',
        html_url: 'https://github.com/org/repo/commit/abc1234',
        commit: {
          message: 'feat: add user authentication flow',
          author: { name: 'Developer', date: new Date().toISOString() },
        },
      },
    ];
    const draftClean = buildPrDraft('org/repo', mockCommits, []);
    assert(draftClean.commitCount === 1, 'Commit count should be 1');
    assert(draftClean.securityStatus === 'clean', 'Security status should be clean');
    assert(draftClean.markdown.includes('Terverifikasi Aman'), 'Markdown should note safe verification');
    assert(draftClean.markdown.includes('feat: add user authentication flow'), 'Markdown should list commit');

    // 2. Critical security findings path
    const mockFindings: SecurityFinding[] = [
      {
        id: '1',
        type: 'secret_leak',
        severity: 'critical',
        title: 'Kunci API Google',
        description: 'Terpapar di config.ts',
        recommendation: 'Gunakan .env',
      },
    ];
    const draftCritical = buildPrDraft('org/repo', mockCommits, mockFindings);
    assert(draftCritical.securityStatus === 'critical', 'Security status should be critical');
    assert(draftCritical.markdown.includes('Kritis'), 'Markdown should emphasize critical warnings');

    // 3. Empty commits fallback path
    const draftEmpty = buildPrDraft('org/repo', [], []);
    assert(draftEmpty.commitCount === 0, 'Commit count should be 0');
    assert(draftEmpty.title.includes('Pembaruan terverifikasi'), 'Title should have fallback text');
  } catch (err: any) {
    console.error(`[Module:ai] Error in runPrDraftBuilderTests: ${err.message || err}`);
    return false;
  }

  return passed;
}
