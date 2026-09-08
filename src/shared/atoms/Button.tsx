import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = 
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 ' +
    'outline-none select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] ' +
    'after:absolute after:-inset-1.5 after:content-[\'\']'; // Invisible hit-slop expanding tap target
  
  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900 shadow-sm rounded-lg',
    secondary: 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 shadow-sm rounded-lg',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg',
    ghost: 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 h-8',
    md: 'px-4 py-2 text-sm gap-2 h-10',
    lg: 'px-5 py-2.5 text-base gap-2.5 h-12',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      {children && <span className="whitespace-nowrap">{children}</span>}
    </button>
  );
}
