import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Card({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden transition-all duration-200 ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/60">
          <div className="flex flex-col gap-0.5">
            {title && <h3 className="font-semibold text-zinc-800 text-sm leading-none">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center gap-1">{headerAction}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
