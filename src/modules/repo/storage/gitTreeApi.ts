import { CONFIG } from '../../../core/config';

export interface RepoTreeEntry {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

export const gitTreeApi = {
  async fetchRecursiveTree(
    fullName: string,
    token?: string | null
  ): Promise<{ tree: RepoTreeEntry[]; truncated: boolean }> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    try {
      // Ambil default branch atau HEAD recursive tree
      const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/git/trees/HEAD?recursive=1`, { headers });
      if (!res.ok) {
        // Fallback ke branch main jika HEAD gagal
        const fallbackRes = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/git/trees/main?recursive=1`, { headers });
        if (!fallbackRes.ok) return { tree: [], truncated: false };
        const fallbackData = await fallbackRes.json();
        return { tree: fallbackData.tree || [], truncated: !!fallbackData.truncated };
      }
      const data = await res.json();
      return { tree: data.tree || [], truncated: !!data.truncated };
    } catch (err: any) {
      console.error(`[Module:Repo] Error fetching recursive tree: ${err?.message || err}`);
      return { tree: [], truncated: false };
    }
  },
};
