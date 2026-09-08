export interface GitStatusResponse {
  branch: string;
  lastCommitHash: string;
  lastCommitMessage: string;
  hasRemote: boolean;
  remoteUrl?: string;
  isClean: boolean;
}

export interface GitPushPayload {
  repoUrl: string;
  token?: string;
}

export interface GitPushResult {
  success: boolean;
  message: string;
}
