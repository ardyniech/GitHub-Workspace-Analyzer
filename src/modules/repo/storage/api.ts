import { CONFIG } from '../../../core/config';
import { fileApi, RepoContentItem } from './fileApi';

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
}

export type { RepoContentItem };
export { fileApi };

const safeAtob = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str.replace(/\s/g, ''))));
  } catch {
    return atob(str);
  }
};

export const repoApi = {
  async fetchUserRepos(token: string): Promise<Repository[]> {
    const res = await fetch(`${CONFIG.GITHUB_API}/user/repos?sort=updated&per_page=20`, {
      headers: { Authorization: `token ${token}` },
    });
    if (!res.ok) throw new Error('Gagal memuat repositori Anda.');
    return res.json();
  },

  async fetchPublicRepos(username: string): Promise<Repository[]> {
    const res = await fetch(`${CONFIG.GITHUB_API}/users/${username}/repos?sort=updated&per_page=20`);
    if (!res.ok) throw new Error('Gagal memuat repositori publik.');
    return res.json();
  },

  async fetchReadme(fullName: string, token?: string | null): Promise<string> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/readme`, { headers });
    if (!res.ok) return 'README tidak ditemukan untuk repositori ini.';
    const data = await res.json();
    return safeAtob(data.content);
  },

  fetchContents: fileApi.fetchContents,
  fetchFileContent: fileApi.fetchFileContent,
  commitFile: fileApi.commitFile,
};
