import React from 'react';
import { Rocket, ExternalLink, Loader2, RefreshCcw, XCircle } from 'lucide-react';
import { useDeployEngine } from '../logic/deployEngine';
import { Button } from '../../../shared/atoms/Button';

interface DeploymentCardProps {
  repoFullName: string;
}

export function DeploymentCard({ repoFullName }: DeploymentCardProps) {
  const { record, triggerDeploy, clearDeploy } = useDeployEngine(repoFullName);

  const renderContent = () => {
    if (!record || record.status === 'idle') {
      return (
        <div className="flex flex-col items-center justify-center py-3">
          <Rocket className="w-6 h-6 text-zinc-300 mb-2" />
          <p className="text-[10px] text-zinc-500 mb-2 text-center">Belum ada deployment aktif</p>
          <Button size="sm" onClick={triggerDeploy} className="h-6 text-[10px] bg-zinc-900 text-white hover:bg-zinc-800">
            Deploy Sekarang
          </Button>
        </div>
      );
    }

    if (record.status === 'building') {
      return (
        <div className="flex flex-col items-center justify-center py-3">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mb-2" />
          <p className="text-[10px] text-zinc-600 font-medium animate-pulse">Menyiapkan One-Click Preview...</p>
        </div>
      );
    }

    if (record.status === 'success') {
      return (
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700">Preview Live</span>
            </div>
            <p className="text-[9px] text-zinc-500 leading-tight mb-2">
              Berhasil di-deploy via GitHub Actions.
            </p>
          </div>
          <div className="flex gap-2">
            <a 
              href={record.previewUrl || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 h-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Buka Preview
            </a>
            <Button size="sm" onClick={triggerDeploy} className="w-6 h-6 p-0 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-100">
              <RefreshCcw className="w-3 h-3" />
            </Button>
            <Button size="sm" onClick={clearDeploy} className="w-6 h-6 p-0 bg-white border border-zinc-200 text-zinc-500 hover:text-rose-500 hover:bg-rose-50">
              <XCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-3">
        <p className="text-[10px] text-rose-500 font-medium mb-2">Deploy Gagal</p>
        <Button size="sm" onClick={triggerDeploy} className="h-6 text-[10px] bg-zinc-900 text-white hover:bg-zinc-800">
          Coba Lagi
        </Button>
      </div>
    );
  };

  return (
    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col gap-2 justify-between">
      <div className="flex items-center justify-between border-b border-dashed border-zinc-200 pb-1.5 mb-1">
        <span className="font-bold text-[10.5px] text-zinc-700 flex items-center gap-1.5">
          <Rocket className="w-3.5 h-3.5 text-blue-500" />
          Automated Deployment
        </span>
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
