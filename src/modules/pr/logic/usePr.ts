import { useState, useEffect } from 'react';
import { prApi, PullRequest } from '../storage/api';
import { authStorage } from '../../auth/storage/local';

export function usePr(repoFullName: string) {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!repoFullName) return;

    let isMounted = true;
    const loadPrs = async () => {
      setLoading(true);
      setError('');
      try {
        const token = authStorage.getToken();
        const data = await prApi.fetchPullRequests(repoFullName, token);
        if (isMounted) setPrs(data);
      } catch (err: any) {
        if (isMounted) {
          console.error('[Module:PR] Error in usePr:', err.message || err);
          setError(err.message || 'Gagal memuat Pull Requests');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPrs();
    return () => {
      isMounted = false;
    };
  }, [repoFullName]);

  return { prs, loading, error };
}
