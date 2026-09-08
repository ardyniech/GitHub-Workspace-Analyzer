import React, { useState } from 'react';
import { RepoRecommendation } from '../logic/types';
import { executeBatchRecommendations, BatchFixProgress } from '../logic/batchFixExecutor';
import { Button } from '../../../shared/atoms/Button';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface BatchFixButtonProps {
  repoFullName: string;
  recommendations: RepoRecommendation[];
  onBatchDone?: () => void;
}

export function BatchFixButton({ repoFullName, recommendations, onBatchDone }: BatchFixButtonProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BatchFixProgress | null>(null);

  const pendingCount = recommendations.filter((r) => r.status === 'idle').length;

  const handleStartBatch = async () => {
    if (isRunning || pendingCount === 0) return;
    setIsRunning(true);

    try {
      await executeBatchRecommendations(repoFullName, recommendations, (p) => {
        setProgress(p);
      });
      onBatchDone?.();
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(null);
      }, 1500);
    }
  };

  if (pendingCount === 0) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Seluruh Rekomendasi Selesai Diterapkan</span>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleStartBatch}
      disabled={isRunning}
      icon={
        isRunning ? (
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
        ) : (
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
        )
      }
      className="h-7 text-[10px] font-bold bg-indigo-900 hover:bg-indigo-950 text-white px-3 rounded-xl shadow-xs transition-all"
    >
      {isRunning && progress
        ? `Menjadwalkan (${progress.current}/${progress.total})...`
        : `⚡ Selesaikan Semua (${pendingCount} Rekomendasi Sekaligus)`}
    </Button>
  );
}
