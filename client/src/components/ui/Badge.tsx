import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export type BadgeVariant =
  | 'ai'
  | 'eggplant'
  | 'premium'
  | 'normal'
  | 'royal'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'info'
  | 'orange'
  | 'solar-orange'
  | 'amber'
  | 'teal'
  | 'red'
  | 'navy';

export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<string, { container: string; dot: string }> = {
  ai: {
    container: 'bg-[#F8EAF4] dark:bg-[#A0006D]/20 text-[#A0006D] dark:text-[#E28DC5] border-[#A0006D]/25 dark:border-[#A0006D]/40 font-semibold',
    dot: 'bg-[#A0006D] dark:bg-[#E28DC5]',
  },
  eggplant: {
    container: 'bg-[#F8EAF4] dark:bg-[#A0006D]/20 text-[#A0006D] dark:text-[#E28DC5] border-[#A0006D]/25 dark:border-[#A0006D]/40 font-semibold',
    dot: 'bg-[#A0006D] dark:bg-[#E28DC5]',
  },
  premium: {
    container: 'bg-[#F8EAF4] dark:bg-[#780052]/25 text-[#780052] dark:text-[#F1C5E4] border-[#780052]/25 dark:border-[#780052]/40 font-semibold',
    dot: 'bg-[#780052] dark:bg-[#F1C5E4]',
  },
  normal: {
    container: 'bg-[#EFF7FD] dark:bg-[#4A8BDF]/15 text-[#2459A8] dark:text-[#60A5FA] border-[#DCE7F2] dark:border-[#1E294B]',
    dot: 'bg-[#4A8BDF]',
  },
  royal: {
    container: 'bg-[#EFF7FD] dark:bg-[#4A8BDF]/20 text-[#4A8BDF] dark:text-[#60A5FA] border-[#DCE7F2] dark:border-[#4A8BDF]/30',
    dot: 'bg-[#4A8BDF]',
  },
  success: {
    container: 'bg-[#E8F5F0] dark:bg-[#168A62]/20 text-[#168A62] dark:text-[#34D399] border-[#168A62]/30 dark:border-[#168A62]/40',
    dot: 'bg-[#168A62] dark:bg-[#34D399]',
  },
  warning: {
    container: 'bg-[#FEF7EC] dark:bg-[#D99020]/20 text-[#D99020] dark:text-[#FBBF24] border-[#D99020]/30 dark:border-[#D99020]/40',
    dot: 'bg-[#D99020] dark:bg-[#FBBF24]',
  },
  error: {
    container: 'bg-[#FDF2F2] dark:bg-[#D64545]/20 text-[#D64545] dark:text-[#F87171] border-[#D64545]/30 dark:border-[#D64545]/40',
    dot: 'bg-[#D64545] dark:bg-[#F87171]',
  },
  neutral: {
    container: 'bg-[#EFF7FD] dark:bg-[#152046] text-[#526078] dark:text-[#94A3B8] border-[#DCE7F2] dark:border-[#1E294B]',
    dot: 'bg-[#526078] dark:bg-[#94A3B8]',
  },
  info: {
    container: 'bg-[#EFFAFD] dark:bg-[#4A8BDF]/15 text-[#4A8BDF] dark:text-[#60A5FA] border-[#DCE7F2] dark:border-[#1E294B]',
    dot: 'bg-[#4A8BDF]',
  },
  // Compatibility fallbacks
  orange: {
    container: 'bg-[#F8EAF4] dark:bg-[#A0006D]/20 text-[#A0006D] dark:text-[#E28DC5] border-[#A0006D]/30 dark:border-[#A0006D]/40',
    dot: 'bg-[#A0006D]',
  },
  'solar-orange': {
    container: 'bg-[#F8EAF4] dark:bg-[#A0006D]/20 text-[#A0006D] dark:text-[#E28DC5] border-[#A0006D]/30 dark:border-[#A0006D]/40',
    dot: 'bg-[#A0006D]',
  },
  amber: {
    container: 'bg-[#FEF7EC] dark:bg-[#D99020]/20 text-[#D99020] dark:text-[#FBBF24] border-[#D99020]/30 dark:border-[#D99020]/40',
    dot: 'bg-[#D99020]',
  },
  teal: {
    container: 'bg-[#E8F5F0] dark:bg-[#168A62]/20 text-[#168A62] dark:text-[#34D399] border-[#168A62]/30 dark:border-[#168A62]/40',
    dot: 'bg-[#168A62]',
  },
  red: {
    container: 'bg-[#FDF2F2] dark:bg-[#D64545]/20 text-[#D64545] dark:text-[#F87171] border-[#D64545]/30 dark:border-[#D64545]/40',
    dot: 'bg-[#D64545]',
  },
  navy: {
    container: 'bg-[#EFF7FD] dark:bg-[#4A8BDF]/15 text-[#2459A8] dark:text-[#60A5FA] border-[#DCE7F2] dark:border-[#1E294B]',
    dot: 'bg-[#4A8BDF]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] gap-1',
  sm: 'px-2.5 py-0.5 text-xs gap-1.5',
  md: 'px-3.5 py-1 text-xs gap-2',
};

export default function Badge({
  children,
  variant = 'normal',
  size = 'sm',
  dot = false,
  pulse = false,
  className,
}: BadgeProps) {
  const v = variantStyles[variant] || variantStyles.normal;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-sans font-semibold rounded-full border whitespace-nowrap tracking-wide select-none transition-colors',
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
