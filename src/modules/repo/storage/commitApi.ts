import { CONFIG } from '../../../core/config';

export interface CommitFileChange {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export interface CommitDetail {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
  files?: CommitFileChange[];
}

export interface CommitItem {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export const commitApi = {
  async fetchRecentCommits(
    repoFullName: string,
    token?: string | null,
    limit: number = 5
  ): Promise<CommitItem[]> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    try {
      const res = await fetch(`${CONFIG.GITHUB_API}/repos/${repoFullName}/commits?per_page=${limit}`, { headers });
      if (!res.ok) throw new Error(`Gagal memuat commit: ${res.statusText}`);
      return await res.json();
    } catch (err: any) {
      console.error(`[Module:repo] Error in fetchRecentCommits: ${err.message || err}`);
      throw err;
    }
  },

  async fetchCommitDetail(repoFullName: string, sha: string, token?: string | null): Promise<CommitDetail> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    try {
      const res = await fetch(`${CONFIG.GITHUB_API}/repos/${repoFullName}/commits/${sha}`, { headers });
      if (!res.ok) throw new Error(`Gagal memuat detail diff commit: ${res.statusText}`);
      return await res.json();
    } catch (err: any) {
      console.error(`[Module:repo] Error in fetchCommitDetail: ${err.message || err}`);
      throw err;
    }
  },
};
