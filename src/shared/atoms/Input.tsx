import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
  [key: string]: any;
}

export function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-zinc-600 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3 text-zinc-400 pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full bg-zinc-50 border text-zinc-900 border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white text-sm rounded-lg transition-all duration-200 outline-none h-10 ${
            icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${error ? 'border-red-300 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}
