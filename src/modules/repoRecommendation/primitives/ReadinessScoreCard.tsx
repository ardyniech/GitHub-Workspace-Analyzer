import React from 'react';
import { Award } from 'lucide-react';
import { RepoRecommendationStats } from '../logic/types';

interface ReadinessScoreCardProps {
  stats: RepoRecommendationStats;
}

export function ReadinessScoreCard({ stats }: ReadinessScoreCardProps) {
  return (
    <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-600" />
        <div>
          <div className="text-[10px] font-bold text-indigo-950">Skor Kesiapan Repositori</div>
          <div className="text-[9px] text-indigo-600">
            {stats.completed} dari {stats.total} perbaikan selesai diterapkan ({stats.criticalCount} kritis tersisa)
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-base font-black text-indigo-700">{stats.readinessScore}%</span>
      </div>
    </div>
  );
}
