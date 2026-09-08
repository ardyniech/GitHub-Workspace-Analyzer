import { Router } from 'express';
import { getGitRepoStatus, pushToRemote } from './gitService';
import { rollbackToCommit, createRestoreSnapshot } from './gitRollbackService';

export const gitRouter = Router();

gitRouter.get('/status', (req, res) => {
  try {
    const status = getGitRepoStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Gagal membaca status git.' });
  }
});

gitRouter.post('/push', (req, res) => {
  try {
    const { repoUrl, token, branch } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: 'URL Repositori GitHub target wajib diisi.' });
    }

    const result = pushToRemote(repoUrl, token, branch);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Proses push ke GitHub gagal.' });
  }
});

gitRouter.post('/rollback', (req, res) => {
  try {
    const { commitHash } = req.body;
    if (!commitHash) {
      return res.status(400).json({ error: 'Hash commit wajib disertakan untuk rollback.' });
    }
    const result = rollbackToCommit(commitHash);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Rollback commit gagal.' });
  }
});

gitRouter.post('/snapshot', (req, res) => {
  try {
    const { label } = req.body;
    const result = createRestoreSnapshot(label);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Pembuatan snapshot gagal.' });
  }
});
