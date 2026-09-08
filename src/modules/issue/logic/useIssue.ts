import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/logic/useAuth';
import { issueApi, Issue } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';

export function useIssue(repoFullName: string | undefined) {
  const { token } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (repoFullName) {
      loadIssues();
    } else {
      setIssues([]);
    }
  }, [repoFullName, token]);

  const loadIssues = async () => {
    if (!repoFullName) return;
    setLoading(true);
    setError('');
    try {
      const data = await issueApi.fetchIssues(repoFullName, token);
      setIssues(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat issue.');
    } finally {
      setLoading(false);
    }
  };

  const createNewIssue = async (title: string, body: string) => {
    if (!repoFullName) return;
    if (!token) {
      throw new Error('Hubungkan token GitHub terlebih dahulu.');
    }
    setLoading(true);
    try {
      const newIssue = await issueApi.createIssue(repoFullName, title, body, token);
      setIssues((prev) => [newIssue, ...prev]);
      dispatcher.emit('ISSUE_CREATED', newIssue);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat issue.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    issues,
    loading,
    error,
    loadIssues,
    createNewIssue,
  };
}
