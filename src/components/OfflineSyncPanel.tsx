import React, { useState, useEffect } from 'react';
import { offlineWorker, OfflineAnalysisTask } from '../shared/utils/offlineWorker';
import { workspaceSynchronizer } from '../shared/utils/workspaceSynchronizer';
import { Wifi, WifiOff, CloudLightning, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../shared/atoms/Button';

interface OfflineSyncPanelProps {
  repoFullName: string;
}

export function OfflineSyncPanel({ repoFullName }: OfflineSyncPanelProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<OfflineAnalysisTask[]>(offlineWorker.getQueue());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Synchronize workspace contexts on repo mount/switch
    workspaceSynchronizer.syncRepositoryContext(repoFullName);

    const handleOnline = () => {
      setIsOnline(true);
      offlineWorker.triggerManualSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [repoFullName]);

  const handleToggleNetwork = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      setSyncing(true);
      offlineWorker.processSyncQueue().then(() => {
        setQueue(offlineWorker.getQueue());
        setSyncing(false);
      });
    }
  };

  const handleQueueTask = () => {
    offlineWorker.queueTask(repoFullName, 'Lego-Cellular Dependency Sanity Check', {
      timestamp: new Date().toISOString(),
      ruleSet: 'SOP-Standard-V2',
    });
    setQueue(offlineWorker.getQueue());
  };

  return (
    <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-[10.5px] flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-dashed border-zinc-200 pb-1.5">
        <span className="font-bold text-zinc-700 flex items-center gap-1.5">
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
          Workspace Sync & Offline Queue
        </span>
        <button
          onClick={handleToggleNetwork}
          className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase transition-colors border ${isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}
        >
          {isOnline ? 'Online' : 'Offline'} Mode
        </button>
      </div>

      <div className="flex flex-col gap-1 text-zinc-500 leading-normal">
        <p className="text-[10px]">
          Status Memori AI tersinkronisasi untuk repositori <span className="font-mono text-indigo-700 font-bold">{repoFullName}</span>.
        </p>

        {queue.length > 0 ? (
          <div className="mt-1 bg-white border border-zinc-200 rounded-md p-2 flex flex-col gap-1.5">
            <span className="font-bold text-zinc-700 text-[10px] flex items-center gap-1">
              <CloudLightning className="w-3 h-3 text-indigo-500" />
              Tugas Offline Tertunda ({queue.length}):
            </span>
            <div className="max-h-[80px] overflow-y-auto flex flex-col gap-1">
              {queue.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-1 bg-zinc-50 border border-zinc-100 rounded text-[9.5px]">
                  <span className="font-semibold truncate max-w-[150px]">{task.taskTitle}</span>
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-zinc-200 text-zinc-600 uppercase font-bold">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[9.5px] italic text-zinc-400">Tidak ada tugas analisis AI terpending di antrean.</p>
        )}
      </div>

      <div className="flex gap-1.5 mt-1 border-t border-dashed border-zinc-200 pt-1.5">
        {!isOnline && (
          <Button size="sm" onClick={handleQueueTask} className="h-6 text-[9.5px] font-bold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200">
            Antre Analisis Offline
          </Button>
        )}
        {isOnline && queue.length > 0 && (
          <Button size="sm" onClick={handleToggleNetwork} disabled={syncing} icon={<RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />} className="h-6 text-[9.5px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200">
            Sync Sekarang (Draft PR)
          </Button>
        )}
      </div>
    </div>
  );
}
