import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'lg' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-surface-lowest rounded-lg border border-outline-variant shadow-card',
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, subtitle, trend, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start justify-between">
        <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            {icon}
          </div>
        )}
      </div>
      <p className="text-headline-md text-on-surface">{value}</p>
      {trend && (
        <p className={cn('text-label-md flex items-center gap-1', trend.positive ? 'text-status-paid' : 'text-status-overdue')}>
          <span>{trend.positive ? '↑' : '↓'}</span>
          {trend.value}
        </p>
      )}
      {subtitle && !trend && (
        <p className="text-label-md text-on-surface-variant">{subtitle}</p>
      )}
    </Card>
  );
}
