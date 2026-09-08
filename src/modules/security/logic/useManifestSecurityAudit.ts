import { useState, useEffect } from 'react';
import { useAuth } from '../../auth';
import { fileApi } from '../../repo';
import { ManifestAuditResult } from './manifestTypes';
import { parsePackageJson, parseRequirementsTxt } from './manifestParser';
import { auditManifestWithGemini } from './manifestAuditor';
import { applyAutoUpgradeCommit } from './manifestAutoFixer';

export function useManifestSecurityAudit(repoFullName: string | undefined) {
  const { token } = useAuth();
  const [result, setResult] = useState<ManifestAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const runAudit = async () => {
    if (!repoFullName) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let manifestPath = 'package.json';
      let manifestType: 'package.json' | 'requirements.txt' = 'package.json';
      let fetched = await fileApi.fetchFileContent(repoFullName, 'package.json', token).catch(() => ({ content: '', sha: '' }));

      if (!fetched.content) {
        manifestPath = 'requirements.txt';
        manifestType = 'requirements.txt';
        fetched = await fileApi.fetchFileContent(repoFullName, 'requirements.txt', token).catch(() => ({ content: '', sha: '' }));
      }

      if (!fetched.content) {
        setResult({
          manifestType: 'none',
          manifestPath: '',
          rawContent: '',
          dependencies: [],
          vulnerabilities: [],
          overallRisk: 'safe',
          aiSummary: 'Tidak ditemukan berkas package.json atau requirements.txt pada root repositori ini.',
          outdatedCount: 0,
        });
        return;
      }

      const deps = manifestType === 'package.json' ? parsePackageJson(fetched.content) : parseRequirementsTxt(fetched.content);
      const audit = await auditManifestWithGemini(manifestType, manifestPath, fetched.content, deps, repoFullName);
      setResult(audit);
    } catch (err: any) {
      console.error('[Module:Security] Error in useManifestSecurityAudit:', err);
      setError(err.message || 'Gagal menganalisis berkas manifes repositori.');
    } finally {
      setLoading(false);
    }
  };

  const autoFixUpgrade = async () => {
    if (!result || !repoFullName || !token) {
      setError('Token autentikasi GitHub diperlukan untuk melakukan upgrade otomatis.');
      return;
    }
    setUpgrading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await applyAutoUpgradeCommit(repoFullName, result, token);
      setSuccessMsg(res.message);
      await runAudit();
    } catch (err: any) {
      setError(err.message || 'Gagal menerapkan pembaruan versi.');
    } finally {
      setUpgrading(false);
    }
  };

  useEffect(() => {
    setResult(null);
    if (repoFullName) runAudit();
  }, [repoFullName, token]);

  return { result, loading, upgrading, error, successMsg, reAudit: runAudit, autoFixUpgrade };
}
