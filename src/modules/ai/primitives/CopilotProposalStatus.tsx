import React from 'react';
import { Check, ExternalLink } from 'lucide-react';

interface CopilotProposalStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  commitUrl?: string;
  errorMessage?: string;
  isMultiFile: boolean;
  pushedFiles: string[];
}

export function CopilotProposalStatus({
  status,
  commitUrl,
  errorMessage,
  isMultiFile,
  pushedFiles,
}: CopilotProposalStatusProps) {
  if (status === 'success') {
    return (
      <div className="flex flex-col gap-1 text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {isMultiFile
              ? `${pushedFiles.length} berkas berhasil diperbarui:`
              : 'Perubahan tersimpan di repositori.'}
          </span>
          {commitUrl && (
            <a
              href={commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center gap-0.5"
            >
              <span>Commit</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        {isMultiFile && pushedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {pushedFiles.map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded bg-emerald-100/70 font-mono text-[9.5px]">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
        {errorMessage}
      </p>
    );
  }

  return null;
}
