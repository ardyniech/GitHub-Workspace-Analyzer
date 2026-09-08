import React from 'react';
import { CodebaseHealthReport } from '../logic/codebaseHealthScanner';
import { Activity, ShieldCheck, Layers, FileCode2, Check } from 'lucide-react';

interface HealthScanCardProps {
  report: CodebaseHealthReport;
}

export function HealthScanCard({ report }: HealthScanCardProps) {
  return (
    <div className="p-3 bg-zinc-900 text-white rounded-xl border border-zinc-800 flex flex-col gap-2 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-zinc-100">Live Codebase Health Inspector</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
          Skor: {report.overallScore}/100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="p-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-1 text-zinc-400 text-[9px]">
            <FileCode2 className="w-3 h-3 text-sky-400" /> &lt;125 Baris
          </div>
          <div className="text-[11px] font-black text-zinc-100 mt-0.5">{report.lineCountScore}%</div>
        </div>

        <div className="p-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-1 text-zinc-400 text-[9px]">
            <Layers className="w-3 h-3 text-indigo-400" /> Modularitas
          </div>
          <div className="text-[11px] font-black text-zinc-100 mt-0.5">{report.modularityScore}%</div>
        </div>

        <div className="p-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-1 text-zinc-400 text-[9px]">
            <ShieldCheck className="w-3 h-3 text-rose-400" /> Keamanan
          </div>
          <div className="text-[11px] font-black text-zinc-100 mt-0.5">{report.securityScore}%</div>
        </div>

        <div className="p-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-1 text-zinc-400 text-[9px]">
            <Check className="w-3 h-3 text-emerald-400" /> CI/CD Gate
          </div>
          <div className="text-[11px] font-black text-zinc-100 mt-0.5">{report.cicdScore}%</div>
        </div>
      </div>
    </div>
  );
}
