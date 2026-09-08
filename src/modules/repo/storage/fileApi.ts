import { CONFIG } from '../../../core/config';

export interface RepoContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha: string;
}

const safeAtob = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str.replace(/\s/g, ''))));
  } catch {
    return atob(str);
  }
};

const safeBtoa = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const fileApi = {
  async fetchContents(fullName: string, path: string = '', token?: string | null): Promise<RepoContentItem[]> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const url = path
      ? `${CONFIG.GITHUB_API}/repos/${fullName}/contents/${path}`
      : `${CONFIG.GITHUB_API}/repos/${fullName}/contents`;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Gagal memuat isi direktori: ${path || 'root'}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.sort((a: RepoContentItem, b: RepoContentItem) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'dir' ? -1 : 1;
    });
  },

  async fetchFileContent(fullName: string, path: string, token: string): Promise<{ content: string; sha: string }> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/contents/${path}`, {
      headers: { Authorization: `token ${token}` },
    });
    if (!res.ok) {
      if (res.status === 404) return { content: '', sha: '' };
      throw new Error(`Gagal membaca berkas: ${path}`);
    }
    const data = await res.json();
    return { content: safeAtob(data.content), sha: data.sha };
  },

  async commitFile(
    fullName: string,
    path: string,
    content: string,
    commitMessage: string,
    token: string,
    sha?: string
  ): Promise<any> {
    const body: any = { message: commitMessage, content: safeBtoa(content) };
    if (sha) body.sha = sha;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Gagal commit berkas ke ${path}`);
    }
    return res.json();
  },
};
