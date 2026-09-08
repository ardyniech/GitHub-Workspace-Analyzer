import { Router } from 'express';
import { getGitRepoStatus, pushToRemote } from './gitService';

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
    const { repoUrl, token } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: 'URL Repositori GitHub target wajib diisi.' });
    }

    const result = pushToRemote(repoUrl, token);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Proses push ke GitHub gagal.' });
  }
});
