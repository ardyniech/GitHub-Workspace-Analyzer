import { CONFIG } from '../../../core/config';

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string | null;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Label[];
  comments?: number;
}

export const issueApi = {
  async fetchIssues(fullName: string, token?: string | null): Promise<Issue[]> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/issues?state=all&per_page=30`, { headers });
    if (!res.ok) throw new Error('Gagal memuat issue dari repositori.');
    const data = await res.json();
    // Filter out pull requests
    return data.filter((item: any) => !item.pull_request);
  },

  async createIssue(fullName: string, title: string, body: string, token: string): Promise<Issue> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    if (!res.ok) throw new Error('Gagal membuat issue. Periksa izin token Anda (repo scope).');
    return res.json();
  }
};
