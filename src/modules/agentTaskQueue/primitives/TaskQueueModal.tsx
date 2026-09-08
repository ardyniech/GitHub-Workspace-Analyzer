import React, { useState } from 'react';
import { useTaskQueue } from '../logic/useTaskQueue';
import { TaskQueueCard } from './TaskQueueCard';
import { Button } from '../../../shared/atoms/Button';
import { PlayCircle, PauseCircle, Clock, Trash2, X, RefreshCw, Layers } from 'lucide-react';

interface TaskQueueModalProps {
  onClose: () => void;
}

export function TaskQueueModal({ onClose }: TaskQueueModalProps) {
  const { tasks, summary, reorder, togglePause, cancel, refresh } = useTaskQueue();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">AI Agent Task Queue Dashboard</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Kendalikan tindakan otonom: Susun ulang, jeda, atau batalkan tugas latar belakang secara real-time
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics Widgets */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-indigo-700 uppercase">Aktif Berjalan</span>
            <span className="text-base font-black text-indigo-950 flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              {summary.runningCount}
            </span>
          </div>
          <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-amber-700 uppercase">Dijeda (Paused)</span>
            <span className="text-base font-black text-amber-950 flex items-center gap-1">
              <PauseCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {summary.pausedCount}
            </span>
          </div>
          <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-blue-700 uppercase">Menunggu Antrean</span>
            <span className="text-base font-black text-blue-950 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {summary.pendingCount}
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-emerald-700 uppercase">Total Tugas</span>
            <span className="text-base font-black text-emerald-950">{summary.total}</span>
          </div>
        </div>

        {/* Category Filter and Refresh Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            {['all', 'security', 'refactoring', 'testing', 'deployment'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-1 text-[9.5px] font-bold capitalize rounded-md transition-all cursor-pointer ${
                  filterCategory === cat ? 'bg-white text-indigo-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={refresh}
            icon={<RefreshCw className="w-3 h-3 text-indigo-700" />}
            className="h-6 text-[10px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
          >
            Pindai Antrean
          </Button>
        </div>

        {/* Task List container */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[220px]">
          {filteredTasks.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 font-medium">Antrean tugas kosong atau tidak ada tugas yang cocok.</div>
          ) : (
            filteredTasks.map((task, index) => (
              <TaskQueueCard
                key={task.id}
                task={task}
                index={index}
                totalTasks={filteredTasks.length}
                onReorder={reorder}
                onTogglePause={togglePause}
                onCancel={cancel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
