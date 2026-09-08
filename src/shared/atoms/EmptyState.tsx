import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto gap-3 ${className}`}>
      {Icon && (
        <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-400">
          <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-zinc-800">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
