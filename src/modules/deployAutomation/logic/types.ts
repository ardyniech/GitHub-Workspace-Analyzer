export type DeployStatus = 'idle' | 'building' | 'success' | 'failed';

export interface DeploymentRecord {
  id: string;
  repoFullName: string;
  status: DeployStatus;
  previewUrl: string | null;
  startedAt: number;
  completedAt?: number;
  logs: string[];
}
