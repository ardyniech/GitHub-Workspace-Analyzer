import React, { useState } from 'react';
import { computeSelfAuditMetrics, get30DayAuditDeltas } from '../logic/selfAuditEngine';
import { AuditDeltaCard } from './AuditDeltaCard';
import { Button } from '../../../shared/atoms/Button';
import { ShieldCheck, TrendingUp, Activity, X, RefreshCw, Layers } from 'lucide-react';

interface SelfAuditModalProps {
  onClose: () => void;
}

export function SelfAuditModal({ onClose }: SelfAuditModalProps) {
  const [metrics, setMetrics] = useState(computeSelfAuditMetrics());
  const [deltas, setDeltas] = useState(get30DayAuditDeltas());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics(computeSelfAuditMetrics());
      setDeltas(get30DayAuditDeltas());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Agent Self-Audit & Coding Style Evolution Delta</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Audit mandiri pembaruan Best Practices Manifest & evolusi gaya koding 30 hari terakhir
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-purple-700 uppercase">30-Day Evolution</span>
            <span className="text-base font-extrabold text-purple-900">+{metrics.evolutionTrendPercent}%</span>
          </div>
          <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-emerald-700 uppercase">Type Safety Score</span>
            <span className="text-base font-extrabold text-emerald-900">{metrics.typeSafetyScore}%</span>
          </div>
          <div className="p-2 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-blue-700 uppercase">Architecture Score</span>
            <span className="text-base font-extrabold text-blue-900">{metrics.architectureScore}%</span>
          </div>
          <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-amber-700 uppercase">Total Cycles</span>
            <span className="text-base font-extrabold text-amber-900">{metrics.totalCycles}</span>
          </div>
        </div>

        {/* Subheader & Refresh */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>30-Day Coding Style Delta Timeline ({deltas.length} Perubahan):</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            icon={<RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />}
            className="h-6 text-[10px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
          >
            Audit Ulang
          </Button>
        </div>

        {/* Deltas List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[220px]">
          {deltas.length === 0 ? (
            <div className="text-center py-10 text-zinc-400">Belum ada riwayat delta perubahan gaya koding dalam 30 hari terakhir.</div>
          ) : (
            deltas.map((d) => <AuditDeltaCard key={d.id} delta={d} />)
          )}
        </div>
      </div>
    </div>
  );
}
