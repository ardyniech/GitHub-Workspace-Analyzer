export type WorkflowStatus = 'success' | 'failure' | 'in_progress' | 'queued' | 'cancelled';

export interface WorkflowJob {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'queued';
  conclusion: 'success' | 'failure' | 'skipped' | null;
  startedAt: string;
  completedAt: string | null;
}

export interface WorkflowRunItem {
  id: number;
  name: string;
  workflowName: string;
  status: WorkflowStatus;
  conclusion: 'success' | 'failure' | 'cancelled' | 'timed_out' | null;
  branch: string;
  commitSha: string;
  commitMessage: string;
  actor: {
    login: string;
    avatarUrl: string;
  };
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  jobs: WorkflowJob[];
}

export interface CIPipelineSummary {
  totalRuns: number;
  successCount: number;
  failureCount: number;
  inProgressCount: number;
  successRatePct: number;
  avgDurationSec: number;
}
