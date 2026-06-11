import { cn } from '@/utils/format';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'md',
  className
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const widths = {
    sm: 'max-w-400',
    md: 'max-w-600',
    lg: 'max-w-800',
    xl: 'max-w-1000'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-12 shadow-xl',
          'w-full mx-16',
          widths[width],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-24 py-16 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E3A5F]">{title}</h3>
            <button
              className="p-8 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-20 h-20 text-gray-500" />
            </button>
          </div>
        )}
        
        <div className="px-24 py-20 overflow-auto max-h-[60vh]">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center justify-end gap-12 px-24 py-16 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}