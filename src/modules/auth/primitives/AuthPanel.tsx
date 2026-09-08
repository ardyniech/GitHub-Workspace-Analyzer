import React, { useState } from 'react';
import { useAuth } from '../logic/useAuth';
import { Button } from '../../../shared/atoms/Button';
import { Input } from '../../../shared/atoms/Input';
import { Card } from '../../../shared/atoms/Card';
import { Key, Github, LogOut, ExternalLink } from 'lucide-react';

export function AuthPanel() {
  const { isLoggedIn, username, login, logout, isValidating } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setError('Token tidak boleh kosong');
      return;
    }
    setError('');
    login(tokenInput.trim());
    setTokenInput('');
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-between gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2 font-medium text-zinc-700">
          <Github className="w-4 h-4 text-zinc-800" />
          <span>Terhubung: <strong>{username || 'Memuat...'}</strong></span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          icon={<LogOut className="w-3.5 h-3.5 text-red-500" />}
          onClick={logout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold h-7 py-0.5 px-2"
        >
          Keluar
        </Button>
      </div>
    );
  }

  return (
    <Card
      title="Hubungkan GitHub Account"
      subtitle="Gunakan Personal Access Token (PAT) untuk mengakses repositori pribadi Anda secara aman."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          id="token-input"
          placeholder="Masukkan GitHub PAT Anda (ghp_...)"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          error={error}
          icon={<Key className="w-4 h-4 text-zinc-400" />}
          type="password"
          disabled={isValidating}
        />
        <div className="flex items-center justify-between gap-4 mt-1">
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,write:discussion,read:org&description=GitHub%20Workspace%20Analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-zinc-500 hover:text-zinc-800 font-medium flex items-center gap-1 transition-colors duration-150 underline decoration-zinc-300 hover:decoration-zinc-800"
          >
            Buat PAT baru di GitHub <ExternalLink className="w-3 h-3" />
          </a>
          <Button
            type="submit"
            size="sm"
            disabled={isValidating}
            icon={<Github className="w-3.5 h-3.5" />}
          >
            {isValidating ? 'Menghubungkan...' : 'Hubungkan'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
