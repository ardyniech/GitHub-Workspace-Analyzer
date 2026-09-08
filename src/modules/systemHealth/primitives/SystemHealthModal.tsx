import React, { useState } from 'react';
import { computeSystemHealthSummary, getSystemHealthTimeSeries } from '../logic/systemHealthEngine';
import { HealthChart } from './HealthChart';
import { OsvAuditPanel } from '../../osvAudit';
import { MemoryFragmentationOverlay } from './MemoryFragmentationOverlay';
import { Button } from '../../../shared/atoms/Button';
import { Activity, Zap, Cpu, Sparkles, X, RefreshCw, ShieldAlert } from 'lucide-react';

interface SystemHealthModalProps {
  onClose: () => void;
}

export function SystemHealthModal({ onClose }: SystemHealthModalProps) {
  const [summary, setSummary] = useState(computeSystemHealthSummary());
  const [timeSeries, setTimeSeries] = useState(getSystemHealthTimeSeries());
  const [activeTab, setActiveTab] = useState<'latency' | 'token' | 'improvement' | 'osv'>('latency');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSummary(computeSystemHealthSummary());
      setTimeSeries(getSystemHealthTimeSeries());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">AI Agent System Health Dashboard</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Metrik kinerja real-time: Latensi API, efisiensi token, & OSV Dependency Vulnerability Audit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-indigo-50/80 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-indigo-800">
              <span>Avg Latency</span> <Zap className="w-3 h-3 text-indigo-600" />
            </div>
            <span className="text-base font-black text-indigo-950">{summary.avgLatencyMs} ms</span>
            <span className="text-[8.5px] text-indigo-700 font-semibold">Model: {summary.activeModel}</span>
          </div>

          <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-emerald-800">
              <span>Token Efficiency</span> <Cpu className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-base font-black text-emerald-950">{summary.tokenEfficiencyPct}%</span>
            <span className="text-[8.5px] text-emerald-700 font-semibold">Optimasi Prompt Context</span>
          </div>

          <div className="p-2 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-purple-800">
              <span>Success Rate</span> <Sparkles className="w-3 h-3 text-purple-600" />
            </div>
            <span className="text-base font-black text-purple-950">{summary.overallSuccessRate}%</span>
            <span className="text-[8.5px] text-purple-700 font-semibold">Evolusi Auto-Improvement</span>
          </div>
        </div>

        {/* Diagnostic memory fragmentation overlay */}
        <MemoryFragmentationOverlay />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            <button
              onClick={() => setActiveTab('latency')}
              className={`px-2 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${activeTab === 'latency' ? 'bg-white text-indigo-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              API Latency
            </button>
            <button
              onClick={() => setActiveTab('token')}
              className={`px-2 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${activeTab === 'token' ? 'bg-white text-emerald-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Token Efficiency
            </button>
            <button
              onClick={() => setActiveTab('improvement')}
              className={`px-2 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${activeTab === 'improvement' ? 'bg-white text-purple-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Improvement
            </button>
            <button
              onClick={() => setActiveTab('osv')}
              className={`px-2 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'osv' ? 'bg-white text-amber-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              <span>OSV Audit</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            icon={<RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />}
            className="h-6 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
          >
            Refresh
          </Button>
        </div>

        {activeTab === 'latency' && <HealthChart data={timeSeries} metricKey="latencyMs" color="#6366f1" unit=" ms" />}
        {activeTab === 'token' && <HealthChart data={timeSeries} metricKey="tokenEfficiencyPct" color="#10b981" unit="%" />}
        {activeTab === 'improvement' && <HealthChart data={timeSeries} metricKey="improvementSuccessPct" color="#a855f7" unit="%" />}
        {activeTab === 'osv' && <OsvAuditPanel />}
      </div>
    </div>
  );
}
