import { execSync } from 'child_process';

export interface GitCommitInfo {
  hash: string;
  author: string;
  message: string;
  relativeTime: string;
}

export interface GitRepoStatus {
  branch: string;
  lastCommitHash: string;
  lastCommitMessage: string;
  hasRemote: boolean;
  remoteUrl?: string;
  isClean: boolean;
  recentCommits: GitCommitInfo[];
}

export function getGitRepoStatus(): GitRepoStatus {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim() || 'main';
    const lastCommitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const lastCommitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
    
    let remoteUrl = '';
    try {
      remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    } catch {
      // No remote configured yet
    }

    let recentCommits: GitCommitInfo[] = [];
    try {
      const logOut = execSync('git log -n 5 --pretty=format:"%h|%an|%s|%cr"', { encoding: 'utf8' }).trim();
      if (logOut) {
        recentCommits = logOut.split('\n').map(l => {
          const [hash = '', author = '', message = '', relativeTime = ''] = l.split('|');
          return { hash, author, message, relativeTime };
        });
      }
    } catch {
      // Empty git log
    }

    const isClean = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length === 0;

    return {
      branch,
      lastCommitHash,
      lastCommitMessage,
      hasRemote: Boolean(remoteUrl),
      remoteUrl: remoteUrl || undefined,
      isClean,
      recentCommits,
    };
  } catch (error: any) {
    console.error('[Module:Git] Error in getGitRepoStatus:', error?.message);
    throw new Error('Gagal mengambil status repositori Git lokal.');
  }
}

export function pushToRemote(repoUrl: string, token?: string, branch = 'main'): { success: boolean; message: string } {
  try {
    let targetUrl = repoUrl.trim();
    if (token && targetUrl.startsWith('https://')) {
      const cleanUrl = targetUrl.replace(/^https:\/\/(.*@)?github\.com\//, '');
      targetUrl = `https://${token}@github.com/${cleanUrl}`;
    }

    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch {
      // Ignored
    }

    execSync(`git remote add origin ${targetUrl}`, { stdio: 'pipe' });

    try {
      execSync('git add -A', { stdio: 'pipe' });
      execSync('git commit -m "feat: automated sync from AI Agent DevCenter"', { stdio: 'pipe' });
    } catch {
      // Clean
    }

    const pushOutput = execSync(`git push -u origin HEAD:refs/heads/${branch} --force`, { encoding: 'utf8', stdio: 'pipe' });
    return {
      success: true,
      message: `Push ke cabang '${branch}' di GitHub berhasil! ${pushOutput ? `(${pushOutput.trim()})` : ''}`,
    };
  } catch (error: any) {
    console.error('[Module:Git] Error pushing to GitHub:', error?.message);
    let safeMsg = error?.message || 'Push ke GitHub gagal.';
    if (token) {
      safeMsg = safeMsg.replace(new RegExp(token, 'g'), '***');
    }
    throw new Error(safeMsg);
  }
}
