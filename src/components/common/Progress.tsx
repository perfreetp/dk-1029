import { cn } from '@/utils/format';
import type { ReactNode } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  label?: ReactNode;
}

export function Progress({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  color = 'primary',
  className,
  label
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const colors = {
    primary: 'bg-[#38B2AC]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return colors[color];
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-8">
          {label ? (
            <span className="text-sm text-gray-600">{label}</span>
          ) : (
            <span className="text-sm text-gray-600">进度</span>
          )}
          <span className="text-sm font-medium text-[#1E3A5F]">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="mt-4 text-xs text-gray-500 text-right">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  className
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: '#38B2AC',
    success: '#48BB78',
    warning: '#ED8936',
    danger: '#E53E3E'
  };

  const getProgressColor = () => {
    if (percentage >= 90) return '#E53E3E';
    if (percentage >= 70) return '#ED8936';
    return colors[color];
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-[#1E3A5F]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}