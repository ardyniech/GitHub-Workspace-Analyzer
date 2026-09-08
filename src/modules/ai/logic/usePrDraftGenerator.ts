import { useState } from 'react';
import { commitApi, CommitItem } from '../../repo';
import { securityScanner, SecurityFinding } from '../../security';
import { buildPrDraft, PrDraftResult } from './prDraftBuilder';

export function usePrDraftGenerator(repoFullName?: string, token?: string | null) {
  const [draft, setDraft] = useState<PrDraftResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDraft = async (
    activeCodeContent?: string,
    activeFilePath?: string
  ): Promise<PrDraftResult | null> => {
    if (!repoFullName) return null;
    setLoading(true);
    setError('');

    try {
      let commits: CommitItem[] = [];
      try {
        commits = await commitApi.fetchRecentCommits(repoFullName, token, 5);
      } catch (err: any) {
        console.warn(`[Module:ai] Warning in fetching commits for PR draft: ${err.message}`);
      }

      let findings: SecurityFinding[] = [];
      if (activeCodeContent && activeFilePath) {
        const report = securityScanner.scanContent(activeCodeContent, activeFilePath);
        findings = report.findings;
      }

      const result = buildPrDraft(repoFullName, commits, findings);
      setDraft(result);
      return result;
    } catch (err: any) {
      console.error(`[Module:ai] Error in generateDraft: ${err.message || err}`);
      setError(err.message || 'Gagal membuat draft pull request.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = () => setDraft(null);

  return {
    draft,
    loading,
    error,
    generateDraft,
    clearDraft,
  };
}
