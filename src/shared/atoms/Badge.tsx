import React from 'react';

interface BadgeProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const styles = {
    primary: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    secondary: 'bg-blue-50 text-blue-700 border-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap leading-none uppercase tracking-wide ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
