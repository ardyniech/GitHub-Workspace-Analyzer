import React, { useState } from 'react';
import { useTaskQueue } from '../logic/useTaskQueue';
import { TaskQueueCard } from './TaskQueueCard';
import { TaskQueueStats } from './TaskQueueStats';
import { Button } from '../../../shared/atoms/Button';
import { X, RefreshCw, Layers, Bot } from 'lucide-react';

interface TaskQueueModalProps {
  onClose: () => void;
}

export function TaskQueueModal({ onClose }: TaskQueueModalProps) {
  const { tasks, summary, reorder, togglePause, cancel, executeTask, executeAll, refresh } = useTaskQueue();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isExecutingAll, setIsExecutingAll] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const handleExecuteAll = async () => {
    setIsExecutingAll(true);
    await executeAll();
    setIsExecutingAll(false);
  };

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
                Kendalikan tindakan otonom: Susun ulang, jeda, atau eksekusi tugas latar belakang langsung ke Agen AI
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics Widgets */}
        <TaskQueueStats summary={summary} />

        {/* Category Filter and Execute Actions */}
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

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
              icon={<RefreshCw className="w-3 h-3 text-zinc-600" />}
              className="h-6 text-[10px] font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
            >
              Pindai
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteAll}
              disabled={isExecutingAll || summary.pendingCount === 0}
              icon={<Bot className="w-3 h-3 text-white" />}
              className="h-6 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isExecutingAll ? 'Mengeksekusi...' : 'Eksekusi Antrean'}
            </Button>
          </div>
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
                onExecute={executeTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
