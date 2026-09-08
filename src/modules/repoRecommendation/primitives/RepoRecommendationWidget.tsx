import React, { useState } from 'react';
import { useRepoRecommendation } from '../logic/useRepoRecommendation';
import { QuickActionGrid } from './QuickActionGrid';
import { BatchFixButton } from './BatchFixButton';
import { RepoRecommendationModal } from './RepoRecommendationModal';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';

interface RepoRecommendationWidgetProps {
  repoFullName: string;
}

export function RepoRecommendationWidget({ repoFullName }: RepoRecommendationWidgetProps) {
  const [showModal, setShowModal] = useState(false);
  const { quickActions, rawRecommendations, stats, executeQuickAction, executingId, refresh } =
    useRepoRecommendation(repoFullName);

  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-2xs">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-zinc-900 leading-tight">
              AI Repo Improvements & Quick Actions
            </h4>
            <p className="text-[9.5px] text-zinc-500">
              Tombol cepat & usulan perbaikan otonom berstandar industri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-[9px]">
            <Award className="w-3 h-3 text-indigo-500" />
            <span>Kesiapan: {stats.readinessScore}%</span>
          </div>
          <BatchFixButton
            repoFullName={repoFullName}
            recommendations={rawRecommendations}
            onBatchDone={refresh}
          />
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            icon={<ArrowRight className="w-3 h-3" />}
            className="h-7 text-[9px] font-bold bg-zinc-900 hover:bg-black text-white px-2 rounded-xl"
          >
            Detail
          </Button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <QuickActionGrid
        quickActions={quickActions}
        onExecute={executeQuickAction}
        isExecuting={Boolean(executingId)}
      />

      {/* Modal */}
      {showModal && (
        <RepoRecommendationModal
          repoFullName={repoFullName}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
