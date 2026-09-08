import React, { useState } from 'react';
import { useRepo } from '../logic/useRepo';
import { Input } from '../../../shared/atoms/Input';
import { Button } from '../../../shared/atoms/Button';
import { Loading } from '../../../shared/atoms/Loading';
import { Repository } from '../storage/api';
import { Search, FolderGit2, Star, GitFork, AlertCircle } from 'lucide-react';

interface RepoSelectorProps {
  onSelect: (repo: Repository) => void;
  selectedRepo: Repository | null;
}

export function RepoSelector({ onSelect, selectedRepo }: RepoSelectorProps) {
  const {
    repos,
    loading,
    error,
    loadPublicRepos,
    selectRepo,
  } = useRepo();
  const [userInput, setUserInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      loadPublicRepos(userInput.trim());
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          id="search-user"
          placeholder="Cari Username GitHub..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          icon={<Search className="w-4 h-4 text-zinc-400" />}
        />
        <Button type="submit" size="sm">Cari</Button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <Loading message="Mengambil repositori..." />
      ) : (
        <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1.5 pr-1">
          {repos.length > 0 ? (
            repos.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <button
                  key={repo.id}
                  onClick={() => {
                    selectRepo(repo);
                    onSelect(repo);
                  }}
                  className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-150 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderGit2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`} />
                    <span className="font-semibold truncate">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork className="w-3 h-3" />
                      {repo.forks_count}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-center text-xs text-zinc-400 py-6">
              Belum ada repositori. Cari pengguna di atas atau hubungkan akun Anda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
