import React from 'react';
import { Loader2, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { AgentTask, PipelineStatus } from '../logic/useAgentPipeline';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AgentPipelineViewProps {
  tasks: AgentTask[];
  status: PipelineStatus;
  repoFullName?: string;
}

export function AgentPipelineView({ tasks, status, repoFullName }: AgentPipelineViewProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Progress header */}
      <div className="flex items-center gap-2 mb-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
        {status === 'running' && <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />}
        {status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        {status === 'failed' && <XCircle className="w-5 h-5 text-rose-500" />}
        <span className="text-sm font-bold text-white tracking-wide">
          {status === 'running' ? 'EXECUTING PIPELINE...' : status === 'success' ? 'PIPELINE COMPLETE' : 'PIPELINE FAILED'}
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-zinc-800">
        {tasks.map((task, idx) => (
          <div key={task.id} className="relative flex flex-col gap-2 z-10 pl-8">
            <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center bg-zinc-950 border-2 border-zinc-800">
              {task.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
               task.status === 'failed' ? <XCircle className="w-4 h-4 text-rose-500" /> :
               task.status === 'running' ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> :
               <div className="w-2 h-2 rounded-full bg-zinc-700" />}
            </div>
            
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
              <span className={`text-xs font-mono font-bold ${task.status === 'pending' ? 'text-zinc-500' : 'text-zinc-300'}`}>
                [{idx + 1}] {task.name}
              </span>
              {task.status === 'running' && <span className="text-[10px] text-emerald-500 animate-pulse">Running...</span>}
            </div>

            {task.result && (
              <div className="bg-zinc-900 rounded-xl p-3 text-xs text-zinc-300 border border-zinc-800 shadow-inner overflow-x-auto custom-markdown-dark mt-1">
                <MarkdownRenderer text={task.result} repoFullName={repoFullName} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
