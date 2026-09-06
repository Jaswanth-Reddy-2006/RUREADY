import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export type BadgeVariant =
  | 'orange'
  | 'solar-orange'
  | 'amber'
  | 'teal'
  | 'success'
  | 'red'
  | 'error'
  | 'warning'
  | 'neutral'
  | 'navy'
  | 'info';

export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  orange: {
    container:
      'bg-solar-orange-500/15 text-solar-orange-400 border-solar-orange-500/30 shadow-[0_0_12px_rgba(255,122,0,0.12)]',
    dot: 'bg-solar-orange-500 shadow-[0_0_6px_rgba(255,122,0,0.9)]',
  },
  'solar-orange': {
    container:
      'bg-solar-orange-500/15 text-solar-orange-400 border-solar-orange-500/30 shadow-[0_0_12px_rgba(255,122,0,0.12)]',
    dot: 'bg-solar-orange-500 shadow-[0_0_6px_rgba(255,122,0,0.9)]',
  },
  amber: {
    container: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]',
  },
  teal: {
    container:
      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]',
  },
  success: {
    container:
      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]',
  },
  red: {
    container:
      'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    dot: 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]',
  },
  error: {
    container:
      'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    dot: 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]',
  },
  warning: {
    container:
      'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
    dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]',
  },
  neutral: {
    container: 'bg-white/[0.06] text-white/80 border-white/[0.12]',
    dot: 'bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.6)]',
  },
  navy: {
    container: 'bg-obsidian-800 text-white/90 border-white/[0.1] shadow-sm',
    dot: 'bg-solar-orange-500 shadow-[0_0_6px_rgba(255,122,0,0.8)]',
  },
  info: {
    container:
      'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.1)]',
    dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] gap-1',
  sm: 'px-2.5 py-0.5 text-xs gap-1.5',
  md: 'px-3.5 py-1 text-xs gap-2',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  pulse = false,
  className,
}: BadgeProps) {
  const v = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-display font-semibold rounded-full border whitespace-nowrap tracking-wide backdrop-blur-sm select-none',
        v.container,
        sizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full shrink-0',
            v.dot,
            pulse && 'animate-pulse',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
