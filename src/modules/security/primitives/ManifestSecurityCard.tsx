import React from 'react';
import { useManifestSecurityAudit } from '../logic/useManifestSecurityAudit';
import { triggerAgentAuditExecution } from '../logic/triggerFixPr';
import { VulnerabilityList } from './VulnerabilityList';
import { ManifestAuditMetrics } from './ManifestAuditMetrics';
import { ManifestAuditSummaryBox } from './ManifestAuditSummaryBox';
import { Card } from '../../../shared/atoms/Card';
import { Button } from '../../../shared/atoms/Button';
import { Loading } from '../../../shared/atoms/Loading';
import { RefreshCw, FileCode, CheckCircle, Bot } from 'lucide-react';

interface ManifestSecurityCardProps {
  repoFullName: string;
}

export function ManifestSecurityCard({ repoFullName }: ManifestSecurityCardProps) {
  const { result, loading, upgrading, error, successMsg, reAudit, autoFixUpgrade } =
    useManifestSecurityAudit(repoFullName);

  const hasVulnerabilities = !!(result && result.vulnerabilities.length > 0);
  const hasUpgrades = !!(result && result.vulnerabilities.some((v) => v.fixedIn));

  return (
    <Card
      title="Audit Keamanan Dependensi"
      subtitle="Analisis package.json & requirements.txt dengan Gemini"
      headerAction={
        <div className="flex items-center gap-1.5">
          {hasVulnerabilities && result && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => triggerAgentAuditExecution(repoFullName, result)}
              disabled={loading || upgrading}
              icon={<Bot className="w-3.5 h-3.5 text-emerald-300" />}
              className="h-7 text-xs font-bold bg-indigo-700 hover:bg-indigo-800"
            >
              Eksekusi via Agent
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={reAudit}
            disabled={loading || upgrading}
            icon={<RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${loading ? 'animate-spin' : ''}`} />}
            className="h-7 text-xs font-semibold"
          >
            Pindai Ulang
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {loading && <Loading message="Membaca manifes & menganalisis dependensi dengan AI..." />}
        {upgrading && <Loading message="Menerapkan upgrade versi & melakukan commit ke GitHub..." />}
        {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{error}</p>}
        {successMsg && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!loading && result && (
          <>
            {result.manifestType === 'none' ? (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Tidak ditemukan berkas <code>package.json</code> atau <code>requirements.txt</code> pada repositori ini.</span>
              </div>
            ) : (
              <>
                <ManifestAuditMetrics result={result} />

                <ManifestAuditSummaryBox
                  repoFullName={repoFullName}
                  result={result}
                  upgrading={upgrading}
                  hasUpgrades={hasUpgrades}
                  onAutoFixUpgrade={autoFixUpgrade}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-800">Temuan & Rekomendasi Versi</span>
                    {hasVulnerabilities && (
                      <button
                        onClick={() => triggerAgentAuditExecution(repoFullName, result)}
                        className="text-[10.5px] text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Bot className="w-3 h-3 text-indigo-600" />
                        Minta Agent Eksekusi Semua
                      </button>
                    )}
                  </div>
                  <VulnerabilityList
                    items={result.vulnerabilities}
                    onFixItem={(vuln) => triggerAgentAuditExecution(repoFullName, result, vuln)}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export const SecurityAuditCard = ManifestSecurityCard;
