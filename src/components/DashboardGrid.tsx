import React from 'react';
import { Network, ShieldAlert, Eye, Play, Bot } from 'lucide-react';
import { Button } from '../shared/atoms/Button';
import { DeploymentCard } from '../modules/deployAutomation';

interface DashboardGridProps {
  repoFullName: string;
  visNodesLength: number;
  pfScore: number;
  pfStatus: string;
  isRunning: boolean;
  getStatusIcon: () => React.ReactNode;
  onOpenVis: () => void;
  onOpenPf: () => void;
  onTriggerRefactor: () => void;
  onTriggerAudit: () => void;
}

export function DashboardGrid({
  repoFullName,
  visNodesLength,
  pfScore,
  pfStatus,
  isRunning,
  getStatusIcon,
  onOpenVis,
  onOpenPf,
  onTriggerRefactor,
  onTriggerAudit,
}: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Card 1: Repo Visualizer */}
      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col gap-2 justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10.5px] text-zinc-700 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-indigo-500" />
              Repo Visualizer
            </span>
            <span className="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border text-zinc-500">
              {visNodesLength} Modul
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
            Peta dependensi modular diperbarui langsung.
          </p>
        </div>
        <div className="flex gap-1.5 pt-2 border-t border-dashed border-zinc-200 mt-1">
          <Button size="sm" onClick={onOpenVis} icon={<Eye className="w-3 h-3" />} className="h-6 text-[9.5px] font-bold bg-white text-indigo-700 hover:bg-zinc-100 border border-zinc-200 shrink-0 flex-1 justify-center">
            Buka Peta
          </Button>
          <Button size="sm" onClick={onTriggerRefactor} icon={<Bot className="w-3 h-3 text-indigo-600" />} className="h-6 text-[9.5px] font-bold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 w-8 p-0 flex justify-center shrink-0" title="Tugaskan Agen Refactor">
          </Button>
        </div>
      </div>

      {/* Card 2: Commit Pre-Flight */}
      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col gap-2 justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10.5px] text-zinc-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Pre-Flight
            </span>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={`text-[9.5px] font-bold ${pfScore >= 80 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {pfScore}/100
              </span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
            {isRunning ? 'Menganalisis kode...' : pfStatus === 'passed' ? 'Lolos standar produksi.' : 'Status audit komit.'}
          </p>
        </div>
        <div className="flex gap-1.5 pt-2 border-t border-dashed border-zinc-200 mt-1">
          <Button size="sm" onClick={onOpenPf} icon={<Eye className="w-3 h-3" />} className="h-6 text-[9.5px] font-bold bg-white text-rose-700 hover:bg-zinc-100 border border-zinc-200 shrink-0 flex-1 justify-center">
            Buka Audit
          </Button>
          <Button size="sm" onClick={onTriggerAudit} disabled={isRunning} icon={<Play className="w-3 h-3 text-rose-600 animate-pulse" />} className="h-6 text-[9.5px] font-bold bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 w-8 p-0 flex justify-center shrink-0">
          </Button>
        </div>
      </div>

      {/* Card 3: Automated Deployment */}
      <DeploymentCard repoFullName={repoFullName} />
    </div>
  );
}
