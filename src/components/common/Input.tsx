import { cn } from '@/utils/format';
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1E3A5F] mb-8">
            {label}
            {props.required && <span className="text-red-500 ml-4">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full h-40 px-16 text-sm rounded-6 border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#38B2AC] focus:border-transparent',
              error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 hover:border-gray-300',
              icon && 'pl-40',
              suffix && 'pr-40',
              props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
              className
            )}
            {...props}
          />
          
          {suffix && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-4 text-xs text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1E3A5F] mb-8">
            {label}
            {props.required && <span className="text-red-500 ml-4">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            'w-full px-16 py-12 text-sm rounded-6 border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#38B2AC] focus:border-transparent',
            'resize-none',
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 hover:border-gray-300',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-4 text-xs text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1E3A5F] mb-8">
            {label}
            {props.required && <span className="text-red-500 ml-4">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={cn(
            'w-full h-40 px-16 text-sm rounded-6 border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#38B2AC] focus:border-transparent',
            'appearance-none bg-white',
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 hover:border-gray-300',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-4 text-xs text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';