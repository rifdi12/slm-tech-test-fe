import { cn } from '@/lib/utils';

type BadgeVariant = 'paid' | 'sent' | 'overdue' | 'draft' | 'active' | 'inactive' | 'pending';

const variantStyles: Record<BadgeVariant, string> = {
  paid: 'bg-status-paid-bg text-status-paid',
  sent: 'bg-status-sent-bg text-status-sent',
  overdue: 'bg-status-overdue-bg text-status-overdue',
  draft: 'bg-status-draft-bg text-status-draft',
  active: 'bg-status-active-bg text-status-active',
  inactive: 'bg-status-inactive-bg text-status-inactive',
  pending: 'bg-status-pending-bg text-status-pending',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-label-md font-semibold uppercase tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    PAID: 'paid',
    SENT: 'sent',
    OVERDUE: 'overdue',
    DRAFT: 'draft',
    PENDING: 'pending',
  };
  const variant = map[status] ?? 'draft';
  return <Badge variant={variant}>{status}</Badge>;
}

export function CustomerStatusBadge({ status }: { status: string }) {
  const variant: BadgeVariant = status === 'ACTIVE' ? 'active' : 'inactive';
  return <Badge variant={variant}>{status}</Badge>;
}
