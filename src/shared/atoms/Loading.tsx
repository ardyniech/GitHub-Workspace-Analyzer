import React from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = 'Memuat data...', className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-center ${className}`}>
      <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      <p className="text-xs text-zinc-500 font-medium">{message}</p>
    </div>
  );
}
