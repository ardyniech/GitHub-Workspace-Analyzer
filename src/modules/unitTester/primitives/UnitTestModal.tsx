import React, { useState } from 'react';
import { runAutomatedTests } from '../logic/testRunner';
import { TestSuiteSummary } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { CheckCircle2, FlaskConical, Play, ShieldCheck, X } from 'lucide-react';

interface UnitTestModalProps {
  repoFullName?: string;
  onClose: () => void;
}

export function UnitTestModal({ repoFullName, onClose }: UnitTestModalProps) {
  const [summary, setSummary] = useState<TestSuiteSummary>(runAutomatedTests(repoFullName));
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setSummary(runAutomatedTests(repoFullName));
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Automated Unit Test Suite</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Verifikasi integritas logika & tingkat cakupan kode (*Code Coverage*)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Test Summary Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Passed Tests</span>
            <span className="text-lg font-black text-emerald-950">{summary.passedCount} / {summary.totalTests}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Coverage</span>
            <span className="text-lg font-black text-emerald-950">{summary.coveragePercentage}%</span>
          </div>
          <div className="flex items-center justify-end">
            <Button size="sm" variant="primary" onClick={handleRun} disabled={isRunning} icon={<Play className="w-3.5 h-3.5" />} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">
              {isRunning ? 'Menguji...' : 'Jalankan Test'}
            </Button>
          </div>
        </div>

        {/* Test Cases List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 min-h-[200px]">
          {summary.results.map((res) => (
            <div key={res.id} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-zinc-900 block truncate">{res.testName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{res.filePath}</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-2">{res.durationMs}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
