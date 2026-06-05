import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-gray-800 focus:ring-gray-500',
  secondary: 'bg-secondary text-white hover:bg-teal-700 focus:ring-teal-500',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-high focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-low focus:ring-gray-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
