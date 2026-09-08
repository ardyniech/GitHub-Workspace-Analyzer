import React from 'react';
import { ManifestAuditResult } from '../logic/manifestTypes';

interface ManifestAuditMetricsProps {
  result: ManifestAuditResult;
}

export function ManifestAuditMetrics({ result }: ManifestAuditMetricsProps) {
  const isHighRisk = result.overallRisk === 'critical' || result.overallRisk === 'high';
  const isMedRisk = result.overallRisk === 'medium';

  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-0.5">
        <span className="text-[10px] text-zinc-400 font-medium">Manifes Terdeteksi</span>
        <span className="font-mono font-bold text-zinc-900 text-[11px] truncate">{result.manifestPath}</span>
      </div>
      <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-0.5">
        <span className="text-[10px] text-zinc-400 font-medium">Total Dependensi</span>
        <span className="font-bold text-zinc-900">{result.dependencies.length} paket</span>
      </div>
      <div
        className={`p-2 rounded-xl border flex flex-col gap-0.5 ${
          isHighRisk
            ? 'bg-red-50 border-red-200 text-red-900'
            : isMedRisk
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        <span className="text-[10px] font-medium opacity-80">Tingkat Risiko</span>
        <span className="font-bold uppercase text-[11px]">{result.overallRisk}</span>
      </div>
    </div>
  );
}
