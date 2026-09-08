export interface GitCommitInfo {
  hash: string;
  author: string;
  message: string;
  relativeTime: string;
}

export interface GitStatusResponse {
  branch: string;
  lastCommitHash: string;
  lastCommitMessage: string;
  hasRemote: boolean;
  remoteUrl?: string;
  isClean: boolean;
  recentCommits?: GitCommitInfo[];
}

export interface GitPushPayload {
  repoUrl: string;
  token?: string;
  branch?: string;
}

export interface GitPushResult {
  success: boolean;
  message: string;
}
