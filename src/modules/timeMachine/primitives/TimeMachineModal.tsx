import React from 'react';
import { useTimeMachine } from '../logic/useTimeMachine';
import { CommitTimelineSnapshot } from './CommitTimelineSnapshot';
import { SnapshotCreator } from './SnapshotCreator';
import { History, X, AlertCircle, RefreshCw } from 'lucide-react';

interface TimeMachineModalProps {
  onClose: () => void;
}

export function TimeMachineModal({ onClose }: TimeMachineModalProps) {
  const {
    commits,
    isLoading,
    isOperating,
    activeRollbackHash,
    error,
    executeRollback,
    createSnapshot,
    refresh,
  } = useTimeMachine();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 text-xs max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">
                Time Machine & Safe Rollback
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Pulihkan kode ke titik waktu sebelumnya atau buat checkpoint baru
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={refresh}
              title="Segarkan Riwayat"
              disabled={isLoading || isOperating}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Create Snapshot Section */}
        <SnapshotCreator
          isOperating={isOperating}
          onCreateSnapshot={createSnapshot}
        />

        {/* Snapshots Timeline List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-[55vh]">
          {isLoading && commits.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-[11px]">
              Memuat titik pemulihan...
            </div>
          ) : commits.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-[11px]">
              Belum ada riwayat commit snapshot yang terdeteksi.
            </div>
          ) : (
            commits.map((c, idx) => (
              <CommitTimelineSnapshot
                key={c.hash}
                commit={c}
                isLatest={idx === 0}
                isOperating={isOperating}
                isCurrentRollingBack={activeRollbackHash === c.hash}
                onRollback={executeRollback}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
