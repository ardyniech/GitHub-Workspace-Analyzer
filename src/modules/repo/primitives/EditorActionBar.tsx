import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { Input } from '../../../shared/atoms/Input';
import { GitCommit, Sparkles, Loader2, Check, ExternalLink } from 'lucide-react';

interface EditorActionBarProps {
  commitMsg: string;
  setCommitMsg: (val: string) => void;
  onAskAi: () => void;
  onPush: () => void;
  pushing: boolean;
  status: 'idle' | 'success' | 'error';
  errorText: string;
  commitUrl: string;
}

export function EditorActionBar({
  commitMsg,
  setCommitMsg,
  onAskAi,
  onPush,
  pushing,
  status,
  errorText,
  commitUrl,
}: EditorActionBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Input
          id="commit-msg-input"
          placeholder="Pesan commit..."
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          className="text-xs"
        />
        <div className="flex gap-1.5 w-full sm:w-auto shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={onAskAi}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            className="border border-zinc-200 text-xs text-zinc-700"
          >
            Minta AI Edit
          </Button>
          <Button
            size="sm"
            onClick={onPush}
            disabled={pushing}
            icon={pushing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitCommit className="w-3.5 h-3.5" />}
            className="text-xs font-bold bg-zinc-900 text-white"
          >
            {pushing ? 'Menyimpan...' : 'Push ke Repo'}
          </Button>
        </div>
      </div>

      {status === 'success' && (
        <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center justify-between border border-emerald-200 animate-in fade-in">
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            Commit & Push berhasil disimpan!
          </span>
          {commitUrl && (
            <a
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-[10.5px] font-semibold"
            >
              Lihat di GitHub <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{errorText}</p>
      )}
    </div>
  );
}
