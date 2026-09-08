import React from 'react';
import { QuickActionItem } from '../logic/types';
import { ShieldAlert, Workflow, FlaskConical, Split, BookOpen, Zap, Play } from 'lucide-react';

interface QuickActionGridProps {
  quickActions: QuickActionItem[];
  onExecute: (action: QuickActionItem) => void;
  isExecuting?: boolean;
}

const ICON_MAP = {
  ShieldAlert,
  Workflow,
  FlaskConical,
  Split,
  BookOpen,
  Zap,
};

export function QuickActionGrid({ quickActions, onExecute, isExecuting }: QuickActionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {quickActions.map((action) => {
        const IconComponent = ICON_MAP[action.iconName] || Zap;
        return (
          <button
            key={action.id}
            type="button"
            disabled={isExecuting}
            onClick={() => onExecute(action)}
            className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-xs active:scale-98 ${action.colorClass}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="p-1 rounded-lg bg-white/80 shadow-2xs">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[8.5px] font-bold">
                <Play className="w-2.5 h-2.5 fill-current" /> Jalankan
              </span>
            </div>
            <div>
              <div className="text-[10.5px] font-bold leading-tight">{action.label}</div>
              <div className="text-[8.5px] opacity-75 truncate mt-0.5">{action.sublabel}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
