import { CONFIG } from '../../../core/config';

export const branchApi = {
  async getDefaultBranch(fullName: string, token?: string | null): Promise<string> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}`, { headers });
    if (!res.ok) throw new Error(`Gagal mendapatkan info repository ${fullName}`);
    const data = await res.json();
    return data.default_branch || 'main';
  },

  async getBranchSha(fullName: string, branch: string, token: string): Promise<string> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/git/ref/heads/${branch}`, {
      headers: { Authorization: `token ${token}` },
    });
    if (!res.ok) throw new Error(`Gagal mendapatkan SHA untuk branch ${branch}`);
    const data = await res.json();
    return data.object.sha;
  },

  async createBranch(fullName: string, newBranch: string, baseSha: string, token: string): Promise<any> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: baseSha
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // If branch already exists, it might throw 422, we can ignore or return error.
      throw new Error(err.message || `Gagal membuat branch ${newBranch}`);
    }
    return res.json();
  },

  async createPullRequest(fullName: string, title: string, head: string, base: string, body: string, token: string): Promise<any> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, head, base, body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Gagal membuat Pull Request`);
    }
    return res.json();
  }
};
