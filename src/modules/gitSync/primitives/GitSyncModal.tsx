import React, { useState, useEffect } from 'react';
import { useGitSync } from '../logic/useGitSync';
import { Button } from '../../../shared/atoms/Button';
import { X, GitBranch, GitCommit, UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface GitSyncModalProps {
  onClose: () => void;
  defaultRepoFullName?: string;
  authToken?: string | null;
}

export function GitSyncModal({ onClose, defaultRepoFullName, authToken }: GitSyncModalProps) {
  const { status, isLoading, isPushing, error, result, refreshStatus, pushCode } = useGitSync();
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    if (status?.remoteUrl) {
      setRepoUrl(status.remoteUrl);
    } else if (defaultRepoFullName) {
      setRepoUrl(`https://github.com/${defaultRepoFullName}.git`);
    }
  }, [status, defaultRepoFullName]);

  const handlePush = () => {
    pushCode(repoUrl, authToken || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-900 text-white rounded-lg">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Git Remote & Push ke GitHub</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Sinkronkan commit repositori lokal ke GitHub secara langsung</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Card */}
        <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10px] text-zinc-500 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" /> Cabang Aktif:
              <strong className="text-zinc-800 font-mono font-bold">{status?.branch || 'main'}</strong>
            </span>
            <button onClick={refreshStatus} className="text-[9px] text-zinc-400 hover:text-zinc-600 flex items-center gap-1 cursor-pointer">
              <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-zinc-600 font-mono bg-white p-1.5 rounded border border-zinc-100">
            <GitCommit className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="font-bold text-indigo-700 shrink-0">{status?.lastCommitHash || '8dd2a04'}</span>
            <span className="truncate text-zinc-500">{status?.lastCommitMessage || 'feat: upgrade simulasi ke task agen'}</span>
          </div>
        </div>

        {/* Input Target Repo */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-zinc-700">URL Repositori GitHub Target:</label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository.git"
            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono focus:border-indigo-500 focus:outline-hidden"
          />
          <p className="text-[9px] text-zinc-400">
            {authToken ? '✓ Terautentikasi otomatis menggunakan GitHub Token yang tersimpan' : 'Tip: Hubungkan token di menu Auth untuk izin push ke repo private'}
          </p>
        </div>

        {/* Error or Result Feedback */}
        {error && (
          <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[9.5px] text-rose-700 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 break-all">{error}</div>
          </div>
        )}
        {result && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[9.5px] text-emerald-800 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>{result.message}</div>
          </div>
        )}

        {/* Push Action */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <span className="text-[9.5px] text-zinc-500">
            Atau gunakan menu <strong className="text-zinc-700">Settings &gt; Export to GitHub</strong> di AI Studio.
          </span>
          <Button
            size="sm"
            onClick={handlePush}
            disabled={isPushing || !repoUrl.trim()}
            icon={<UploadCloud className="w-3.5 h-3.5" />}
            className="h-7 text-[10px] font-bold bg-zinc-900 hover:bg-black text-white px-3"
          >
            {isPushing ? 'Mendorong ke GitHub...' : 'Push ke GitHub'}
          </Button>
        </div>
      </div>
    </div>
  );
}
