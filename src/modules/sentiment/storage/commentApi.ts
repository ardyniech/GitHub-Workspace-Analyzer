import { CONFIG } from '../../../core/config';

export interface IssueComment {
  id: number;
  body: string;
  created_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export const commentApi = {
  async fetchIssueComments(
    fullName: string,
    issueNumber: number,
    token?: string | null
  ): Promise<IssueComment[]> {
    try {
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `token ${token}`;

      const url = `${CONFIG.GITHUB_API}/repos/${fullName}/issues/${issueNumber}/comments?per_page=50`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Gagal mengambil komentar (status ${res.status}).`);
      }

      return await res.json();
    } catch (err: any) {
      console.error(`[Module:sentiment] Error in fetchIssueComments: ${err.message || err}`);
      throw new Error(err.message || 'Tidak dapat memuat komentar issue.');
    }
  },
};
