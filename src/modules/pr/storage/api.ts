import { CONFIG } from '../../../core/config';

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  merged_at: string | null;
}

export const prApi = {
  async fetchPullRequests(fullName: string, token?: string | null): Promise<PullRequest[]> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/pulls?state=all&per_page=15`, { headers });
    if (!res.ok) throw new Error('Gagal memuat pull requests dari repositori.');
    return res.json();
  }
};
