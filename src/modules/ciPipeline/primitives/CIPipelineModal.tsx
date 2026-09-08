import React from 'react';
import { CIPipelineCard } from './CIPipelineCard';
import { PlayCircle, X } from 'lucide-react';

interface CIPipelineModalProps {
  repoFullName: string | undefined;
  token?: string | null;
  onClose: () => void;
}

export function CIPipelineModal({ repoFullName, token, onClose }: CIPipelineModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">GitHub Actions CI/CD Pipeline Status</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Pantau kesehatan build, status unit test, dan rilis otomatisasi untuk {repoFullName || 'repositori aktif'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <CIPipelineCard repoFullName={repoFullName} token={token} />
      </div>
    </div>
  );
}
