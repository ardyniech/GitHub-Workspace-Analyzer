import { useState, useEffect } from 'react';
import { GitStatusResponse, GitPushResult } from './types';
import { gitSyncApi } from '../storage/gitSyncApi';
import { dispatcher } from '../../../core/dispatcher';

export function useGitSync() {
  const [status, setStatus] = useState<GitStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GitPushResult | null>(null);

  const loadStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gitSyncApi.fetchStatus();
      setStatus(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat status repositori.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const pushCode = async (repoUrl: string, token?: string, branch?: string) => {
    if (!repoUrl.trim()) {
      setError('URL Repositori GitHub wajib diisi.');
      return;
    }

    setIsPushing(true);
    setError(null);
    setResult(null);

    try {
      const res = await gitSyncApi.push({ repoUrl: repoUrl.trim(), token, branch: branch?.trim() || undefined });
      setResult(res);
      dispatcher.emit('notify:push', {
        type: 'success',
        title: 'Push GitHub Berhasil',
        message: `Kode berhasil dipush ke GitHub (cabang: ${branch?.trim() || 'main'})!`,
      });
      await loadStatus();
    } catch (err: any) {
      const msg = err?.message || 'Push ke GitHub gagal. Periksa izin akses atau URL repo.';
      setError(msg);
      dispatcher.emit('notify:push', {
        type: 'error',
        title: 'Push Gagal',
        message: msg,
      });
    } finally {
      setIsPushing(false);
    }
  };

  return {
    status,
    isLoading,
    isPushing,
    error,
    result,
    refreshStatus: loadStatus,
    pushCode,
  };
}
