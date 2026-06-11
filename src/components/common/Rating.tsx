import { cn } from '@/utils/format';
import { Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

export function RatingStars({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  className
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map(rating => (
        <button
          key={rating}
          type="button"
          className={cn(
            'transition-all duration-200',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizes[size],
              rating <= displayValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
      
      {!readonly && (
        <span className="ml-8 text-sm text-gray-600">
          {value > 0 ? `${value} 分` : '未评分'}
        </span>
      )}
    </div>
  );
}

interface RatingDisplayProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingDisplay({
  value,
  max = 5,
  showValue = true,
  size = 'md',
  className
}: RatingDisplayProps) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map(rating => (
        <Star
          key={rating}
          className={cn(
            sizes[size],
            rating <= value
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-8 text-sm font-medium text-[#1E3A5F]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}