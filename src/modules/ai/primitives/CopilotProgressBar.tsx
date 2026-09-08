import React from 'react';
import { PushProgress } from '../logic/useCopilotPush';

interface CopilotProgressBarProps {
  progress: PushProgress;
}

export function CopilotProgressBar({ progress }: CopilotProgressBarProps) {
  const fileName = progress.currentPath.split('/').pop() || progress.currentPath;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
        <span className="truncate max-w-[200px]" title={progress.currentPath}>
          [{progress.current}/{progress.total}] {fileName}
        </span>
        <span className="font-bold text-emerald-600">{progress.percent}%</span>
      </div>
      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
