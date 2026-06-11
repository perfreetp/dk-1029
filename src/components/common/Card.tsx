import { cn } from '@/utils/format';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-12',
    md: 'p-20',
    lg: 'p-32'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
        'border border-gray-100',
        hover && 'hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-16', className)}>
      <div>
        <h3 className="text-lg font-semibold text-[#1E3A5F]">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-4">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('text-sm text-gray-600', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-16 pt-16 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}