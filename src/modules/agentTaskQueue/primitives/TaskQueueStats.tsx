import React from 'react';
import { TaskQueueSummary } from '../logic/types';
import { PlayCircle, PauseCircle, Clock } from 'lucide-react';

interface TaskQueueStatsProps {
  summary: TaskQueueSummary;
}

export function TaskQueueStats({ summary }: TaskQueueStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-indigo-700 uppercase">Aktif Berjalan</span>
        <span className="text-base font-black text-indigo-950 flex items-center gap-1">
          <PlayCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          {summary.runningCount}
        </span>
      </div>
      <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-amber-700 uppercase">Dijeda (Paused)</span>
        <span className="text-base font-black text-amber-950 flex items-center gap-1">
          <PauseCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {summary.pausedCount}
        </span>
      </div>
      <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-blue-700 uppercase">Menunggu Antrean</span>
        <span className="text-base font-black text-blue-950 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {summary.pendingCount}
        </span>
      </div>
      <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-emerald-700 uppercase">Total Tugas</span>
        <span className="text-base font-black text-emerald-950">{summary.total}</span>
      </div>
    </div>
  );
}
