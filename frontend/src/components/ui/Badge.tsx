import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'purple' | 'blue';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-primary/15 text-primary border-primary/25',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    outline: 'text-foreground border-border',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
