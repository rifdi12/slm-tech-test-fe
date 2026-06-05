import { cn, getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0',
        sizeStyles[size],
        getAvatarColor(name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
