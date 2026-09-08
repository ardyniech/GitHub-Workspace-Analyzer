import React, { useState, useEffect } from 'react';
import { useGitSync } from '../logic/useGitSync';
import { RecentCommitList } from './RecentCommitList';
import { BranchInput } from './BranchInput';
import { Button } from '../../../shared/atoms/Button';
import { X, GitBranch, UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface GitSyncModalProps {
  onClose: () => void;
  defaultRepoFullName?: string;
  authToken?: string | null;
}

export function GitSyncModal({ onClose, defaultRepoFullName, authToken }: GitSyncModalProps) {
  const { status, isLoading, isPushing, error, result, refreshStatus, pushCode } = useGitSync();
  const [repoUrl, setRepoUrl] = useState('');
  const [targetBranch, setTargetBranch] = useState('main');

  useEffect(() => {
    if (status?.remoteUrl) {
      setRepoUrl(status.remoteUrl);
    } else if (defaultRepoFullName) {
      setRepoUrl(`https://github.com/${defaultRepoFullName}.git`);
    }
    if (status?.branch) {
      setTargetBranch(status.branch);
    }
  }, [status, defaultRepoFullName]);

  const handlePush = () => {
    pushCode(repoUrl, authToken || undefined, targetBranch);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 text-xs max-h-[90vh] overflow-y-auto">
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

        {/* Status Header */}
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-[10px] text-zinc-500 flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" /> Cabang Lokal:
            <strong className="text-zinc-800 font-mono font-bold">{status?.branch || 'main'}</strong>
          </span>
          <button onClick={refreshStatus} className="text-[9px] text-zinc-400 hover:text-zinc-600 flex items-center gap-1 cursor-pointer">
            <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Recent Commits List */}
        <RecentCommitList commits={status?.recentCommits} />

        {/* Input Target Repo & Branch */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-700">URL Repositori GitHub Target:</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository.git"
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <BranchInput
            branch={targetBranch}
            onChangeBranch={setTargetBranch}
            defaultBranch={status?.branch || 'main'}
          />

          <p className="text-[9px] text-zinc-400">
            {authToken ? '✓ Terautentikasi otomatis via GitHub Token' : 'Tip: Hubungkan token di menu Auth untuk izin push ke repo privat'}
          </p>
        </div>

        {/* Error or Result Feedback */}
        {(error || result) && (
          <div className={`p-2 rounded-lg text-[9.5px] flex items-start gap-1.5 border ${error ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
            {error ? <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />}
            <div className="flex-1 break-all">{error || result?.message}</div>
          </div>
        )}

        {/* Push Action */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <span className="text-[9px] text-zinc-400">
            Atau menu <strong className="text-zinc-600">Settings &gt; Export to GitHub</strong> di AI Studio.
          </span>
          <Button
            size="sm"
            onClick={handlePush}
            disabled={isPushing || !repoUrl.trim()}
            icon={<UploadCloud className="w-3.5 h-3.5" />}
            className="h-7 text-[10px] font-bold bg-zinc-900 hover:bg-black text-white px-3"
          >
            {isPushing ? `Mendorong ke '${targetBranch}'...` : `Push ke '${targetBranch}'`}
          </Button>
        </div>
      </div>
    </div>
  );
}
