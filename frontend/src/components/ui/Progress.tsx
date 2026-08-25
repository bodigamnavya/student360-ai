import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gradient';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'primary',
  showLabel = false,
  className,
  ...props
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const colors = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
  };

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
