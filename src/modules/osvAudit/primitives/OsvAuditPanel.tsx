import React, { useState, useEffect } from 'react';
import { DependencyAuditSummary } from '../logic/types';
import { runDependencySecurityAudit } from '../logic/osvEngine';
import { OsvVulnerabilityAlertCard } from './OsvVulnerabilityAlertCard';
import { Button } from '../../../shared/atoms/Button';
import { ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OsvAuditPanelProps {
  customDependencies?: Record<string, string>;
}

export function OsvAuditPanel({ customDependencies }: OsvAuditPanelProps) {
  const [summary, setSummary] = useState<DependencyAuditSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    setLoading(true);
    const result = await runDependencySecurityAudit(customDependencies);
    setSummary(result);
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, [customDependencies]);

  if (loading || !summary) {
    return (
      <div className="p-6 text-center text-zinc-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        <span className="font-medium text-xs">Memeriksa database kerentanan OSV...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-indigo-700 uppercase">Dependency Checked</span>
          <span className="text-base font-black text-indigo-950">{summary.totalDependenciesChecked} Paket</span>
        </div>
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-emerald-700 uppercase">Security Score</span>
          <span className="text-base font-black text-emerald-950">{summary.healthScorePct}%</span>
        </div>
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-amber-700 uppercase">Vulnerabilities</span>
          <span className="text-base font-black text-amber-950">{summary.vulnerableCount} Temuan</span>
        </div>
        <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-red-700 uppercase">Critical/High</span>
          <span className="text-base font-black text-red-950">{summary.criticalCount + summary.highCount}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-700 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Hasil Pemindaian OSV Database (npm ecosystem)</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={loadAudit}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />}
          className="h-6 text-[10px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
        >
          Pindai OSV
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
        {summary.alerts.length === 0 ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Semua dependensi bersih! Tidak ditemukan kerentanan di OSV database.</span>
          </div>
        ) : (
          summary.alerts.map((alert) => <OsvVulnerabilityAlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
}
