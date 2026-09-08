export interface CommitSnapshot {
  hash: string;
  author: string;
  message: string;
  relativeTime: string;
  isRestorePoint?: boolean;
}

export interface RollbackResponse {
  success: boolean;
  message: string;
  newCommitHash?: string;
}

export interface TimeMachineState {
  commits: CommitSnapshot[];
  isLoading: boolean;
  isOperating: boolean;
  activeRollbackHash: string | null;
  error: string | null;
}
