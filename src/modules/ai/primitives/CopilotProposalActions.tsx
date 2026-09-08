import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { GitCommit, Check, Loader2, Eye, EyeOff, Layers, XCircle } from 'lucide-react';
import { PushProgress } from '../logic/useCopilotPush';
import { CopilotProposalStatus } from './CopilotProposalStatus';
import { CopilotProgressBar } from './CopilotProgressBar';

interface CopilotProposalActionsProps {
  showDiff: boolean;
  onToggleDiff: () => void;
  onInitiatePush: () => void;
  onCancelPush?: () => void;
  status: 'idle' | 'loading' | 'success' | 'error';
  hasCritical: boolean;
  commitUrl?: string;
  errorMessage?: string;
  fileCount?: number;
  progress?: PushProgress | null;
  pushedFiles?: string[];
}

export function CopilotProposalActions({
  showDiff,
  onToggleDiff,
  onInitiatePush,
  onCancelPush,
  status,
  hasCritical,
  commitUrl,
  errorMessage,
  fileCount = 1,
  progress,
  pushedFiles = [],
}: CopilotProposalActionsProps) {
  const isMultiFile = fileCount > 1;

  const getButtonText = () => {
    if (status === 'loading') {
      if (progress) return `[${progress.current}/${progress.total}] (${progress.percent}%) Menyimpan...`;
      return isMultiFile ? `Menulis & Push ${fileCount} Berkas...` : 'Menulis & Push...';
    }
    if (status === 'success') {
      return isMultiFile ? `Semua ${fileCount} Berkas Berhasil Di-push!` : 'Berhasil Di-push!';
    }
    if (hasCritical) return 'Peringatan: Celah Kritis Terdeteksi';
    return isMultiFile ? `Commit & Push (${fileCount} Berkas)` : 'Commit & Push';
  };

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
      {status === 'loading' && progress && <CopilotProgressBar progress={progress} />}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onToggleDiff}
          icon={showDiff ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          className="text-[10px] h-8 text-zinc-600 border border-zinc-200"
        >
          {showDiff ? 'Tutup' : 'Tinjau Diff'}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onInitiatePush}
          disabled={status === 'loading' || status === 'success' || fileCount === 0}
          icon={
            status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : status === 'success' ? (
              <Check className="w-3.5 h-3.5" />
            ) : isMultiFile ? (
              <Layers className="w-3.5 h-3.5" />
            ) : (
              <GitCommit className="w-3.5 h-3.5" />
            )
          }
          className={`flex-1 text-[10px] h-8 font-bold ${
            status === 'success'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : hasCritical
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-zinc-900 text-white'
          }`}
        >
          {getButtonText()}
        </Button>

        {status === 'loading' && onCancelPush && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancelPush}
            icon={<XCircle className="w-3.5 h-3.5 text-red-500" />}
            className="text-[10px] h-8 text-red-600 border border-red-200 hover:bg-red-50"
          >
            Batal
          </Button>
        )}
      </div>

      <CopilotProposalStatus
        status={status}
        commitUrl={commitUrl}
        errorMessage={errorMessage}
        isMultiFile={isMultiFile}
        pushedFiles={pushedFiles}
      />
    </div>
  );
}
