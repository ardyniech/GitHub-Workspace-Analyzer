import React, { useMemo } from 'react';
import { useRepoRecommendation } from '../logic/useRepoRecommendation';
import { scanCodebaseHealth } from '../logic/codebaseHealthScanner';
import { QuickActionGrid } from './QuickActionGrid';
import { RecommendationCard } from './RecommendationCard';
import { ReadinessScoreCard } from './ReadinessScoreCard';
import { HealthScanCard } from './HealthScanCard';
import { BatchFixButton } from './BatchFixButton';
import { CategoryFilterTabs } from './CategoryFilterTabs';
import { X, Sparkles, Zap, Layers } from 'lucide-react';

interface RepoRecommendationModalProps {
  repoFullName: string;
  onClose: () => void;
}

export function RepoRecommendationModal({ repoFullName, onClose }: RepoRecommendationModalProps) {
  const {
    recommendations,
    rawRecommendations,
    quickActions,
    stats,
    executingId,
    selectedCategory,
    setSelectedCategory,
    executeRecommendation,
    executeQuickAction,
    dismissRecommendation,
    refresh,
  } = useRepoRecommendation(repoFullName);

  const healthReport = useMemo(
    () => scanCodebaseHealth(repoFullName, stats.completed, stats.total),
    [repoFullName, stats.completed, stats.total]
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">
                AI Repository Recommendations & Quick Execution
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Rekomendasi perbaikan cerdas & tombol aksi cepat untuk agen otonom
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Inspector Card */}
        <HealthScanCard report={healthReport} />

        {/* Readiness Score Bar & Batch Fix */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex-1">
            <ReadinessScoreCard stats={stats} />
          </div>
          <BatchFixButton
            repoFullName={repoFullName}
            recommendations={rawRecommendations}
            onBatchDone={refresh}
          />
        </div>

        {/* Section 1: Quick Actions */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-zinc-700 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Tombol Cepat Eksekusi Tugas Agen
          </span>
          <QuickActionGrid
            quickActions={quickActions}
            onExecute={executeQuickAction}
            isExecuting={Boolean(executingId)}
          />
        </div>

        {/* Section 2: Recommendations with Categories */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-bold text-zinc-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Rekomendasi Pilihan AI
            </span>
            <CategoryFilterTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {recommendations.length === 0 ? (
              <div className="col-span-2 text-center py-6 text-zinc-400 text-[10px]">
                Tidak ada rekomendasi dalam kategori ini.
              </div>
            ) : (
              recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onExecute={executeRecommendation}
                  onDismiss={dismissRecommendation}
                  isExecuting={Boolean(executingId)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
