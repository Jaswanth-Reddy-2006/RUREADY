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
    container: 'bg-[#F8EAF4] text-[#A0006D] border-rgba(160,0,109,0.25) font-semibold',
    dot: 'bg-[#A0006D]',
  },
  eggplant: {
    container: 'bg-[#F8EAF4] text-[#A0006D] border-rgba(160,0,109,0.25) font-semibold',
    dot: 'bg-[#A0006D]',
  },
  premium: {
    container: 'bg-[#F8EAF4] text-[#780052] border-rgba(120,0,82,0.25) font-semibold',
    dot: 'bg-[#780052]',
  },
  normal: {
    container: 'bg-[#EFF7FD] text-[#2459A8] border-[#DCE7F2]',
    dot: 'bg-[#4A8BDF]',
  },
  royal: {
    container: 'bg-[#EFF7FD] text-[#4A8BDF] border-[#DCE7F2]',
    dot: 'bg-[#4A8BDF]',
  },
  success: {
    container: 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/30',
    dot: 'bg-[#168A62]',
  },
  warning: {
    container: 'bg-[#FEF7EC] text-[#D99020] border-[#D99020]/30',
    dot: 'bg-[#D99020]',
  },
  error: {
    container: 'bg-[#FDF2F2] text-[#D64545] border-[#D64545]/30',
    dot: 'bg-[#D64545]',
  },
  neutral: {
    container: 'bg-[#EFF7FD] text-[#526078] border-[#DCE7F2]',
    dot: 'bg-[#526078]',
  },
  info: {
    container: 'bg-[#EFFAFD] text-[#4A8BDF] border-[#DCE7F2]',
    dot: 'bg-[#4A8BDF]',
  },
  // Compatibility fallbacks
  orange: {
    container: 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/30',
    dot: 'bg-[#A0006D]',
  },
  'solar-orange': {
    container: 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/30',
    dot: 'bg-[#A0006D]',
  },
  amber: {
    container: 'bg-[#FEF7EC] text-[#D99020] border-[#D99020]/30',
    dot: 'bg-[#D99020]',
  },
  teal: {
    container: 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/30',
    dot: 'bg-[#168A62]',
  },
  red: {
    container: 'bg-[#FDF2F2] text-[#D64545] border-[#D64545]/30',
    dot: 'bg-[#D64545]',
  },
  navy: {
    container: 'bg-[#EFF7FD] text-[#2459A8] border-[#DCE7F2]',
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
        'inline-flex items-center font-sans font-semibold rounded-full border whitespace-nowrap tracking-wide select-none',
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
