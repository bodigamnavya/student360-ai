import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | Date): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatCurrency(amount: number, currency: string = 'LPA'): string {
  return `₹${amount} ${currency}`;
}

export function getRiskBadgeClass(riskLevel?: string): string {
  switch ((riskLevel || '').toLowerCase()) {
    case 'high':
      return 'bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800';
    case 'medium':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    case 'low':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    default:
      return 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}
