import React from 'react';
import { useAgentPerformance } from '../logic/useAgentPerformance';
import { PerformanceChart } from './PerformanceChart';
import { PerformanceStatCards } from './PerformanceStatCards';
import { Activity, X } from 'lucide-react';

interface AgentPerformanceModalProps {
  onClose: () => void;
}

export function AgentPerformanceModal({ onClose }: AgentPerformanceModalProps) {
  const { trendData, metrics } = useAgentPerformance();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 md:p-5 border border-zinc-200 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 leading-none">AI Agent Performance Dashboard</h3>
              <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                Visualisasi tingkat keberhasilan auto-improvement & skor peer review dari waktu ke waktu
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top KPI Stat Cards */}
        <PerformanceStatCards metrics={metrics} />

        {/* Main Line Chart */}
        <PerformanceChart data={trendData} />

        {/* Footer Note */}
        <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-600 flex items-center justify-between">
          <span>💡 <span className="font-semibold text-zinc-800">Sistem Self-Improvement:</span> Grafik di atas terbarui secara real-time berdasarkan hasil audit, peer review, dan commit otomatis.</span>
        </div>
      </div>
    </div>
  );
}
