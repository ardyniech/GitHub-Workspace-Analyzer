import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../storage/api';
import { WeeklyCommitActivity } from './types';

export function useCommitActivity(repoFullName: string, token?: string | null) {
  const [data, setData] = useState<WeeklyCommitActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!repoFullName) return;
    setLoading(true);
    setError(null);
    try {
      const stats = await analyticsApi.fetchCommitActivity(repoFullName, token);
      setData(stats);
    } catch (err: any) {
      console.error(`[Module:Analytics] Error in loadData: ${err?.message || err}`);
      setError(err?.message || 'Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  }, [repoFullName, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, reload: loadData };
}
