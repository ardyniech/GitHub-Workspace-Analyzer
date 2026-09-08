import React from 'react';
import { useManifestSecurityAudit } from '../logic/useManifestSecurityAudit';
import { triggerGenerateFixPr } from '../logic/triggerFixPr';
import { VulnerabilityList } from './VulnerabilityList';
import { ManifestAuditMetrics } from './ManifestAuditMetrics';
import { Card } from '../../../shared/atoms/Card';
import { Button } from '../../../shared/atoms/Button';
import { Loading } from '../../../shared/atoms/Loading';
import { RefreshCw, FileCode, Package, Zap, GitPullRequest, CheckCircle } from 'lucide-react';

interface ManifestSecurityCardProps {
  repoFullName: string;
}

export function ManifestSecurityCard({ repoFullName }: ManifestSecurityCardProps) {
  const { result, loading, upgrading, error, successMsg, reAudit, autoFixUpgrade } = useManifestSecurityAudit(repoFullName);

  const hasVulnerabilities = result && result.vulnerabilities.length > 0;
  const hasUpgrades = result && result.vulnerabilities.some((v) => v.fixedIn);

  return (
    <Card
      title="Audit Keamanan Dependensi"
      subtitle="Analisis package.json & requirements.txt dengan Gemini"
      headerAction={
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

                {/* AI Executive Summary & Action Buttons */}
                {result.aiSummary && (
                  <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-zinc-800 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-purple-900 text-[11px]">
                        <Package className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Ringkasan Eksekutif Gemini</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => triggerGenerateFixPr(repoFullName, result)}
                          icon={<GitPullRequest className="w-3.5 h-3.5 text-purple-700" />}
                          className="h-6 text-[10.5px] px-2 border-purple-200 hover:bg-purple-100"
                        >
                          Generate Fix PR
                        </Button>
                        {hasUpgrades && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={autoFixUpgrade}
                            disabled={upgrading}
                            icon={<Zap className="w-3.5 h-3.5 text-amber-300" />}
                            className="h-6 text-[10.5px] px-2 bg-purple-700 hover:bg-purple-800"
                          >
                            Auto-Fix & Commit
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-[11.5px] leading-relaxed text-zinc-700">{result.aiSummary}</p>
                  </div>
                )}

                {/* Vulnerability & Outdated Items */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-800">Temuan & Rekomendasi Versi</span>
                    {hasVulnerabilities && (
                      <button
                        onClick={() => triggerGenerateFixPr(repoFullName, result)}
                        className="text-[10.5px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <GitPullRequest className="w-3 h-3" />
                        Drafkan Perubahan PR
                      </button>
                    )}
                  </div>
                  <VulnerabilityList items={result.vulnerabilities} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

// Alias for explicit SecurityAuditCard naming
export const SecurityAuditCard = ManifestSecurityCard;
