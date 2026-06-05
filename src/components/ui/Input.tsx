import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-medium text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded border border-outline-variant bg-surface-lowest px-3 py-2 text-body-md text-on-surface',
              'placeholder:text-outline transition-colors',
              'focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20',
              'disabled:bg-surface-high disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-label-md text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-medium text-on-surface">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded border border-outline-variant bg-surface-lowest px-3 py-2 text-body-md text-on-surface',
            'focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20',
            'disabled:bg-surface-high disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-label-md text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-medium text-on-surface">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={cn(
            'w-full rounded border border-outline-variant bg-surface-lowest px-3 py-2 text-body-md text-on-surface',
            'placeholder:text-outline transition-colors resize-none',
            'focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className,
          )}
          {...props}
        />
        {error && <p className="text-label-md text-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
