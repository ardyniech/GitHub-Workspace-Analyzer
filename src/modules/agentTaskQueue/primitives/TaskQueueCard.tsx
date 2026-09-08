import React from 'react';
import { AgentTask } from '../logic/types';
import { Play, Pause, ChevronUp, ChevronDown, Trash2, Cpu, Bot, CheckCircle2 } from 'lucide-react';

interface TaskQueueCardProps {
  key?: React.Key;
  task: AgentTask;
  index: number;
  totalTasks: number;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onTogglePause: (id: string) => void;
  onCancel: (id: string) => void;
  onExecute?: (id: string) => void;
}

export function TaskQueueCard({ task, index, totalTasks, onReorder, onTogglePause, onCancel, onExecute }: TaskQueueCardProps) {
  const isRunning = task.status === 'running';
  const isPaused = task.status === 'paused';
  const isCompleted = task.status === 'completed';

  return (
    <div className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
      isCompleted
        ? 'bg-emerald-50/50 border-emerald-200/80'
        : isRunning
        ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-300/40'
        : isPaused
        ? 'bg-zinc-100/70 border-zinc-200 opacity-70'
        : 'bg-zinc-50 border-zinc-200/90'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          ) : (
            <Cpu className={`w-3.5 h-3.5 shrink-0 ${isRunning ? 'text-indigo-600 animate-spin' : 'text-zinc-500'}`} />
          )}
          <span className="font-bold text-xs text-zinc-900 truncate">{task.title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
            task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' : task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-100 text-zinc-700 border-zinc-300'
          }`}>{task.priority}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
            isCompleted ? 'bg-emerald-100 text-emerald-800' : isRunning ? 'bg-indigo-100 text-indigo-800' : isPaused ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'
          }`}>{task.status}</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-snug">{task.description}</p>

      {(isRunning || task.progress > 0) && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
            <span>Estimasi: {task.estimatedSeconds} dtk</span>
            <span className="font-bold text-indigo-700">{task.progress}%</span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : isPaused ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1.5 border-t border-zinc-200/60">
        <span className="text-[9.5px] font-mono text-zinc-500 uppercase">{task.category}</span>
        <div className="flex items-center gap-1.5">
          {!isCompleted && onExecute && (
            <button
              disabled={isRunning}
              onClick={() => onExecute(task.id)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9.5px] cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
              title="Eksekusi tugas ini melalui Agen AI"
            >
              <Bot className="w-3 h-3" />
              <span>{isRunning ? 'Berjalan...' : 'Eksekusi'}</span>
            </button>
          )}
          <button disabled={index === 0} onClick={() => onReorder(task.id, 'up')} className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30 cursor-pointer" title="Naik"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button disabled={index === totalTasks - 1} onClick={() => onReorder(task.id, 'down')} className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30 cursor-pointer" title="Turun"><ChevronDown className="w-3.5 h-3.5" /></button>
          <div className="w-px h-3 bg-zinc-200 mx-0.5" />
          <button onClick={() => onTogglePause(task.id)} className="p-1 rounded text-zinc-500 hover:text-zinc-800 cursor-pointer" title={isPaused ? 'Lanjutkan' : 'Jeda'}>
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
          </button>
          <button onClick={() => onCancel(task.id)} className="p-1 rounded text-zinc-400 hover:text-red-600 cursor-pointer" title="Batal"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
