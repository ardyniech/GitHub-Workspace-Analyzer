import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/logic/useAuth';
import { repoApi, Repository } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';

export function useRepo() {
  const { token, isLoggedIn } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    if (isLoggedIn && token) {
      loadUserRepos(token);
    } else {
      setRepos([]);
      setSelectedRepo(null);
    }
  }, [isLoggedIn, token]);

  const loadUserRepos = async (tk: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await repoApi.fetchUserRepos(tk);
      setRepos(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat repositori Anda.');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicRepos = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await repoApi.fetchPublicRepos(username.trim());
      setRepos(data);
    } catch (err: any) {
      setError(err.message || 'Pengguna GitHub tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  const selectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    dispatcher.emit('REPO_SELECTED', repo);
  };

  return {
    repos,
    loading,
    error,
    selectedRepo,
    searchUser,
    setSearchUser,
    loadPublicRepos,
    selectRepo,
  };
}
