import { cn } from '@/utils/format';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#1E3A5F] text-white hover:bg-[#2C5282] active:bg-[#1E3A5F]',
    secondary: 'bg-[#38B2AC] text-white hover:bg-[#4ECDC4] active:bg-[#38B2AC]',
    outline: 'border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white',
    ghost: 'text-[#1E3A5F] hover:bg-[#F7FAFC] hover:underline',
    danger: 'bg-[#E53E3E] text-white hover:bg-[#C53030] active:bg-[#E53E3E]'
  };

  const sizes = {
    sm: 'h-32 px-12 text-xs rounded-4',
    md: 'h-40 px-16 text-sm rounded-6',
    lg: 'h-48 px-24 text-base rounded-8'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-8 font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-[#38B2AC] focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-16 h-16 animate-spin" />
      ) : icon ? (
        <span className="w-16 h-16">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}