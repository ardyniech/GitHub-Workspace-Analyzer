import React, { useState, useEffect } from 'react';
import { WorkflowRunItem } from '../logic/types';
import { fetchGitHubWorkflowRuns } from '../storage/ciStorage';
import { computePipelineSummary, filterRunsByStatus, formatDuration } from '../logic/ciEngine';
import { WorkflowRunCard } from './WorkflowRunCard';
import { Button } from '../../../shared/atoms/Button';
import { PlayCircle, CheckCircle2, XCircle, Clock, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

interface CIPipelineCardProps {
  repoFullName: string | undefined;
  token?: string | null;
}

export function CIPipelineCard({ repoFullName, token }: CIPipelineCardProps) {
  const [runs, setRuns] = useState<WorkflowRunItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadRuns = async () => {
    setLoading(true);
    const data = await fetchGitHubWorkflowRuns(repoFullName || 'active-repo', token);
    setRuns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRuns();
  }, [repoFullName, token]);

  const summary = computePipelineSummary(runs);
  const filtered = filterRunsByStatus(runs, statusFilter);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-2xs flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-zinc-900 leading-none">GitHub Actions CI/CD Pipeline</h4>
            <span className="text-[10px] text-zinc-500 font-medium">Status otomatisasi build & deployment real-time</span>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={loadRuns}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />}
          className="h-7 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
        >
          Muat Ulang
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-indigo-700 uppercase">Tingkat Lulus</span>
          <span className="text-sm font-black text-indigo-950">{summary.successRatePct}%</span>
        </div>
        <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-emerald-700 uppercase">Lulus</span>
          <span className="text-sm font-black text-emerald-950">{summary.successCount}</span>
        </div>
        <div className="p-2 bg-red-50 rounded-lg border border-red-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-red-700 uppercase">Gagal</span>
          <span className="text-sm font-black text-red-950">{summary.failureCount}</span>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-purple-700 uppercase">Rata-Rata Waktu</span>
          <span className="text-sm font-black text-purple-950">{formatDuration(summary.avgDurationSec)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 w-fit">
        {['all', 'success', 'failure', 'in_progress'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-2.5 py-0.5 text-[9.5px] font-bold capitalize rounded-md transition-all cursor-pointer ${
              statusFilter === st ? 'bg-white text-indigo-800 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-zinc-400 text-xs">Tidak ada riwayat pipeline untuk status ini.</div>
        ) : (
          filtered.map((run) => <WorkflowRunCard key={run.id} run={run} />)
        )}
      </div>
    </div>
  );
}
