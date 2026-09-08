import React, { useState, useEffect } from 'react';
import { LinterRunSummary, LintIssueCategory } from '../logic/types';
import { runProactiveLinter, applyAutoFix, markIssueStatus } from '../logic/linterEngine';
import { LinterIssueCard } from './LinterIssueCard';
import { Button } from '../../../shared/atoms/Button';
import { ShieldCheck, RefreshCw, Zap, ShieldAlert, X, Activity } from 'lucide-react';

interface ProactiveLinterModalProps {
  onClose: () => void;
}

export function ProactiveLinterModal({ onClose }: ProactiveLinterModalProps) {
  const [summary, setSummary] = useState<LinterRunSummary>(runProactiveLinter());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [scanning, setScanning] = useState(false);

  const handleRunScan = () => {
    setScanning(true);
    setTimeout(() => {
      const res = runProactiveLinter();
      setSummary(res);
      setScanning(false);
    }, 400);
  };

  const handleFix = (id: string) => {
    const res = applyAutoFix(id);
    setSummary(res);
  };

  const handleIgnore = (id: string) => {
    const res = markIssueStatus(id, 'ignored');
    setSummary(res);
  };

  const filteredIssues = summary.issues.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Background Proactive Linter</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Audit otomatis latar belakang: Deteksi bottleneck performa & ancaman keamanan sebelum commit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-indigo-700 uppercase">Total Isu Terbuka</span>
            <span className="text-base font-black text-indigo-950">{summary.totalIssues}</span>
          </div>
          <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-red-700 uppercase">Ancaman Keamanan</span>
            <span className="text-base font-black text-red-950">{summary.securityCount}</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-amber-700 uppercase">Performa Bottleneck</span>
            <span className="text-base font-black text-amber-950">{summary.performanceCount}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-emerald-700 uppercase">Critical Isu</span>
            <span className="text-base font-black text-emerald-950">{summary.criticalCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            {['all', 'security', 'performance', 'type_safety'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-1 text-[9.5px] font-bold capitalize rounded-md transition-all cursor-pointer ${
                  categoryFilter === cat ? 'bg-white text-indigo-800 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunScan}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin text-amber-600' : ''}`} />}
            className="h-6 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100"
          >
            Jalankan Linter Latar Belakang
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[200px]">
          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 font-medium">Tidak ada isu linter ditemukan untuk kategori ini.</div>
          ) : (
            filteredIssues.map((issue) => (
              <LinterIssueCard key={issue.id} issue={issue} onFix={handleFix} onIgnore={handleIgnore} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
