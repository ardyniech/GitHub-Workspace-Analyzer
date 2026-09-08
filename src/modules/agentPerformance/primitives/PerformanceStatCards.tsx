import React from 'react';
import { AgentPerformanceMetrics } from '../logic/types';
import { TrendingUp, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface PerformanceStatCardsProps {
  metrics: AgentPerformanceMetrics;
}

export function PerformanceStatCards({ metrics }: PerformanceStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex flex-col gap-1">
        <div className="flex items-center justify-between text-purple-700">
          <span className="text-[10px] font-bold uppercase tracking-wider">Success Rate</span>
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-purple-950">{metrics.overallSuccessRate}%</span>
          <span className="text-[10px] text-purple-700 font-medium">Rata-rata</span>
        </div>
      </div>

      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col gap-1">
        <div className="flex items-center justify-between text-emerald-700">
          <span className="text-[10px] font-bold uppercase tracking-wider">Peer Review Score</span>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-emerald-950">{metrics.averageReviewScore}</span>
          <span className="text-[10px] text-emerald-700 font-medium">/ 100</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col gap-1">
        <div className="flex items-center justify-between text-blue-700">
          <span className="text-[10px] font-bold uppercase tracking-wider">Auto-Fixes</span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-blue-950">{metrics.totalAutoFixes}</span>
          <span className="text-[10px] text-blue-700 font-medium">Diaplikasikan</span>
        </div>
      </div>

      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col gap-1">
        <div className="flex items-center justify-between text-amber-700">
          <span className="text-[10px] font-bold uppercase tracking-wider">Total Reviews</span>
          <Award className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-amber-950">{metrics.totalReviews}</span>
          <span className="text-[10px] text-amber-700 font-medium">Selesai</span>
        </div>
      </div>
    </div>
  );
}
