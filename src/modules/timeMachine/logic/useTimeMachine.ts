import { useState, useEffect, useCallback } from 'react';
import { CommitSnapshot } from './types';
import { timeMachineApi } from '../storage/timeMachineApi';
import { dispatcher } from '../../../core/dispatcher';

export function useTimeMachine() {
  const [commits, setCommits] = useState<CommitSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [activeRollbackHash, setActiveRollbackHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/git/status');
      if (res.ok) {
        const data = await res.json();
        const formatted: CommitSnapshot[] = (data.recentCommits || []).map((c: any) => ({
          hash: c.hash,
          author: c.author,
          message: c.message,
          relativeTime: c.relativeTime,
          isRestorePoint: c.message.toLowerCase().includes('snapshot') || c.message.toLowerCase().includes('restore'),
        }));
        setCommits(formatted);
      }
    } catch (err: any) {
      console.error('[Module:TimeMachine] Error in fetchHistory:', err?.message || err);
      setError('Gagal memuat riwayat snapshot commit.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    const unsub = dispatcher.on('timeMachine:refresh', () => fetchHistory());
    return () => unsub();
  }, [fetchHistory]);

  const executeRollback = async (hash: string) => {
    if (isOperating) return;
    setIsOperating(true);
    setActiveRollbackHash(hash);
    setError(null);

    try {
      const res = await timeMachineApi.rollback(hash);
      dispatcher.emit('notify:push', {
        type: 'success',
        title: 'Rollback Berhasil',
        message: res.message,
      });
      dispatcher.emit('git:status_updated', { hash: res.newCommitHash });
      await fetchHistory();
    } catch (err: any) {
      const msg = err?.message || 'Gagal memulihkan versi commit.';
      setError(msg);
      dispatcher.emit('notify:push', {
        type: 'error',
        title: 'Rollback Gagal',
        message: msg,
      });
    } finally {
      setIsOperating(false);
      setActiveRollbackHash(null);
    }
  };

  const createSnapshot = async (label: string) => {
    if (isOperating) return;
    setIsOperating(true);
    setError(null);

    try {
      const res = await timeMachineApi.createSnapshot(label);
      dispatcher.emit('notify:push', {
        type: 'success',
        title: 'Titik Pemulihan Tersimpan',
        message: res.message,
      });
      dispatcher.emit('git:status_updated', { hash: res.newCommitHash });
      await fetchHistory();
    } catch (err: any) {
      const msg = err?.message || 'Gagal membuat titik pemulihan.';
      setError(msg);
      dispatcher.emit('notify:push', {
        type: 'error',
        title: 'Snapshot Gagal',
        message: msg,
      });
    } finally {
      setIsOperating(false);
    }
  };

  return {
    commits,
    isLoading,
    isOperating,
    activeRollbackHash,
    error,
    executeRollback,
    createSnapshot,
    refresh: fetchHistory,
  };
}
