import { WorkflowRunItem, CIPipelineSummary } from './types';

export function computePipelineSummary(runs: WorkflowRunItem[]): CIPipelineSummary {
  if (!runs || runs.length === 0) {
    return {
      totalRuns: 0,
      successCount: 0,
      failureCount: 0,
      inProgressCount: 0,
      successRatePct: 0,
      avgDurationSec: 0,
    };
  }

  const totalRuns = runs.length;
  const successCount = runs.filter((r) => r.status === 'success' || r.conclusion === 'success').length;
  const failureCount = runs.filter((r) => r.status === 'failure' || r.conclusion === 'failure').length;
  const inProgressCount = runs.filter((r) => r.status === 'in_progress' || r.status === 'queued').length;

  const successRatePct = Math.round((successCount / totalRuns) * 100);
  const totalDuration = runs.reduce((acc, r) => acc + (r.durationSeconds || 0), 0);
  const avgDurationSec = Math.round(totalDuration / totalRuns);

  return {
    totalRuns,
    successCount,
    failureCount,
    inProgressCount,
    successRatePct,
    avgDurationSec,
  };
}

export function filterRunsByStatus(runs: WorkflowRunItem[], statusFilter: string): WorkflowRunItem[] {
  if (!statusFilter || statusFilter === 'all') return runs;
  return runs.filter((r) => r.status === statusFilter || r.conclusion === statusFilter);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}d`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}d`;
}

export function formatTimeAgo(isoDate: string): string {
  try {
    const now = new Date().getTime();
    const past = new Date(isoDate).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return `${diffSec} detik lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return `${Math.floor(diffSec / 86400)} hari lalu`;
  } catch {
    return 'baru saja';
  }
}
