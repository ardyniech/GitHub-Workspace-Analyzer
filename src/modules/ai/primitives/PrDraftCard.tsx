import React, { useState } from 'react';
import { PrDraftResult } from '../logic/prDraftBuilder';
import { Button } from '../../../shared/atoms/Button';
import { GitPullRequest, Copy, Check, ExternalLink, X, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PrDraftCardProps {
  draft: PrDraftResult;
  repoFullName: string;
  onClose: () => void;
}

export function PrDraftCard({ draft, repoFullName, onClose }: PrDraftCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const isSafe = draft.securityStatus === 'clean';

  return (
    <div className="border border-emerald-300 bg-emerald-50/40 rounded-xl p-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
          <GitPullRequest className="w-4 h-4 text-emerald-600" />
          <span>Draft Deskripsi Pull Request Siap</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isSafe
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isSafe ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            <span>{isSafe ? 'Audit Aman' : 'Ada Catatan'}</span>
          </span>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-emerald-200/80 rounded-lg p-2.5 max-h-[160px] overflow-y-auto text-xs font-mono text-zinc-800 whitespace-pre-wrap select-all">
        {draft.markdown}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
        <span className="text-[10px] text-zinc-500">
          Mencakup <strong>{draft.commitCount} commit</strong> & hasil verifikasi Security Scan
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs h-7.5 bg-white border border-zinc-200 font-semibold text-zinc-700"
          >
            {copied ? 'Tersalin!' : 'Salin Deskripsi'}
          </Button>
          <a
            href={`https://github.com/${repoFullName}/compare`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors h-7.5"
          >
            <span>Buka Buat PR</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
