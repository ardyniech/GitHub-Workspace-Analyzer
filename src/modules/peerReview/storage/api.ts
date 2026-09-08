import { CONFIG } from '../../../core/config';
import { PullRequest } from '../../pr/storage/api';

export interface PrDiffDetail {
  prNumber: number;
  title: string;
  body: string;
  diff: string;
  filesChanged: number;
}

export const peerReviewApi = {
  async fetchPrDiff(repoFullName: string, prNumber: number, token?: string | null): Promise<PrDiffDetail> {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3.diff',
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const diffRes = await fetch(`${CONFIG.GITHUB_API}/repos/${repoFullName}/pulls/${prNumber}`, { headers });
    const diffText = diffRes.ok ? await diffRes.text() : '';

    // fetch PR metadata
    const metaHeaders: HeadersInit = {};
    if (token) metaHeaders['Authorization'] = `token ${token}`;
    const metaRes = await fetch(`${CONFIG.GITHUB_API}/repos/${repoFullName}/pulls/${prNumber}`, { headers: metaHeaders });
    const metaData = metaRes.ok ? await metaRes.json() : { title: `PR #${prNumber}`, body: '', changed_files: 1 };

    return {
      prNumber,
      title: metaData.title,
      body: metaData.body || '',
      diff: diffText.slice(0, 8000), // safe snippet length
      filesChanged: metaData.changed_files || 1,
    };
  },
  
  async postPrComment(repoFullName: string, prNumber: number, body: string, token: string): Promise<any> {
    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${repoFullName}/issues/${prNumber}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) throw new Error('Gagal mengirim ulasan ke Pull Request.');
    return res.json();
  },
};
