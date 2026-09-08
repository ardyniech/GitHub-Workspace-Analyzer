import { useState, useEffect } from 'react';
import { issueApi } from '../../issue/storage/api';
import { useAuth } from '../../auth';
import { calculateIssuePriorityMatrix } from './priorityCalculator';
import { PriorityMatrixSummary } from './priorityTypes';

export function useIssuePriorityMatrix(repoFullName: string | undefined) {
  const { token } = useAuth();
  const [data, setData] = useState<PriorityMatrixSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!repoFullName) {
      setData(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');

    issueApi
      .fetchIssues(repoFullName, token)
      .then((issues) => {
        if (!active) return;
        const matrix = calculateIssuePriorityMatrix(issues);
        setData(matrix);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Gagal memetakan matriks issue');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repoFullName, token]);

  return { data, loading, error };
}
