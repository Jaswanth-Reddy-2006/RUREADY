import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type CardVariant =
  | 'default'
  | 'ai'
  | 'glass'
  | 'obsidian'
  | 'elevated'
  | 'dark'
  | 'soft'
  | 'outline';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type CardGlow = 'none' | 'royal' | 'eggplant' | 'subtle';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  padding?: CardPadding;
  glow?: boolean | CardGlow;
}

const variantStyles: Record<CardVariant, string> = {
  // Official SaaS White Content Surface
  default:
    'bg-white dark:bg-[#1A1A1A] text-[#11183D] dark:text-[#FFFFFF] border border-[#DCE7F2] dark:border-[#262626] shadow-sm',
  // Official Signature AI Card
  ai:
    'bg-[#F8EAF4] dark:bg-[#1C1C1C] text-[#11183D] dark:text-[#FFFFFF] border border-[#A0006D]/25 dark:border-[#BF5AF2]/40 shadow-sm',
  glass:
    'bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md text-[#11183D] dark:text-[#FFFFFF] border border-[#DCE7F2] dark:border-[#262626] shadow-sm',
  obsidian:
    'bg-[#1C1C1C] text-[#FFFFFF] border border-[#262626] shadow-sm',
  elevated:
    'bg-white dark:bg-[#262626] text-[#11183D] dark:text-[#FFFFFF] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:border-[#4A8BDF]',
  dark:
    'bg-[#1C1C1C] text-[#FFFFFF] border border-[#262626] shadow-sm',
  soft:
    'bg-[#EFF7FD] dark:bg-[#1C1C1C] text-[#11183D] dark:text-[#FFFFFF] border border-[#DCE7F2] dark:border-[#262626]',
  outline:
    'bg-transparent text-[#11183D] dark:text-[#FFFFFF] border border-[#DCE7F2] dark:border-[#262626]',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export default function Card({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  glow = 'none',
  className,
  ...props
}: CardProps) {
  const glowStyle =
    glow === true || glow === 'royal'
      ? 'shadow-[0_8px_24px_rgba(74,139,223,0.15)] border-[#4A8BDF]'
      : glow === 'eggplant'
        ? 'shadow-[0_8px_24px_rgba(160,0,109,0.15)] border-[#A0006D]'
        : glow === 'subtle'
          ? 'shadow-sm border-[#DCE7F2]'
          : '';

  return (
    <div
      className={clsx(
        'rounded-2xl relative transition-all duration-250 ease-out',
        variantStyles[variant] || variantStyles.default,
        paddingStyles[padding],
        glowStyle,
        hover &&
          'hover:shadow-md hover:-translate-y-0.5 hover:border-[#4A8BDF] cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
