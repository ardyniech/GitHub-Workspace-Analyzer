export type TaskStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed';
export type TaskCategory = 'optimization' | 'security' | 'testing' | 'deployment' | 'refactoring';

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0 to 100
  estimatedSeconds: number;
  createdAt: string;
}

export interface TaskQueueSummary {
  total: number;
  runningCount: number;
  pendingCount: number;
  pausedCount: number;
  completedCount: number;
}
