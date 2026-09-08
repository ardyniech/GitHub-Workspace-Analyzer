import React, { useState, useEffect } from 'react';
import { getStyleGuideStorage } from '../storage/styleGuideStorage';
import { runAutoImprovementCycle, resetStyleGuideManifest } from '../logic/improvementEngine';
import { StyleGuideManifest } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { Sparkles, Brain, CheckCircle2, RefreshCw, X, RotateCcw, ShieldCheck, TrendingUp } from 'lucide-react';

interface AutoImprovementModalProps {
  repoFullName?: string;
  onClose: () => void;
}

export function AutoImprovementModal({ repoFullName, onClose }: AutoImprovementModalProps) {
  const [manifest, setManifest] = useState<StyleGuideManifest>(getStyleGuideStorage());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunCycle = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const updated = runAutoImprovementCycle(repoFullName);
      setManifest(updated);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleReset = () => {
    const res = resetStyleGuideManifest();
    setManifest(res);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Auto-Improvement Style Guide Engine</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Evaluasi generasi kode terhadap riwayat PR review & pembaruan standar otomatis
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Manifest Stats Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-800 uppercase">Versi Manifest</span>
            <span className="text-base font-black text-indigo-950">v{manifest.version}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-800 uppercase">Total Siklus Evaluasi</span>
            <span className="text-base font-black text-indigo-950">{manifest.totalImprovementCycles} Kali</span>
          </div>
          <div className="flex items-center justify-end">
            <Button size="sm" variant="primary" onClick={handleRunCycle} disabled={isAnalyzing} icon={<RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />} className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold">
              {isAnalyzing ? 'Evaluasi...' : 'Jalankan Siklus'}
            </Button>
          </div>
        </div>

        {/* Active Rules List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[220px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Standar Koding & Pedoman Aktif ({manifest.rules.length}):</span>
            <button onClick={handleReset} className="text-[10px] text-zinc-400 hover:text-red-600 flex items-center gap-1 cursor-pointer">
              <RotateCcw className="w-3 h-3" /> Reset Standar
            </button>
          </div>

          {manifest.rules.map((r) => (
            <div key={r.id} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-bold text-zinc-900">{r.rule}</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                  Impact: {r.impactScore}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed pl-5">{r.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
