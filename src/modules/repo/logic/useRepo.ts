import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/logic/useAuth';
import { repoApi, Repository } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';
import { localCacheManager } from '../../../shared/utils/localCache';

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
      localCacheManager.saveRepos('user_repos', data);
    } catch (err: any) {
      const cached = localCacheManager.getRepos('user_repos');
      if (cached && cached.length > 0) {
        setRepos(cached);
        setError('Menampilkan repositori dari penyimpanan lokal (offline/rate-limited).');
      } else {
        setError(err.message || 'Gagal memuat repositori Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPublicRepos = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    const cacheKey = `public_repos_${username.trim().toLowerCase()}`;
    try {
      const data = await repoApi.fetchPublicRepos(username.trim());
      setRepos(data);
      localCacheManager.saveRepos(cacheKey, data);
    } catch (err: any) {
      const cached = localCacheManager.getRepos(cacheKey);
      if (cached && cached.length > 0) {
        setRepos(cached);
        setError('Menampilkan repositori publik dari penyimpanan lokal (offline/rate-limited).');
      } else {
        setError(err.message || 'Pengguna GitHub tidak ditemukan.');
      }
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
