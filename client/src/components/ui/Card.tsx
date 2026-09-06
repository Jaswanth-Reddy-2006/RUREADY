import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type CardVariant =
  | 'default'
  | 'glass'
  | 'obsidian'
  | 'elevated'
  | 'dark'
  | 'soft'
  | 'outline';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type CardGlow = 'none' | 'orange' | 'subtle';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  padding?: CardPadding;
  glow?: boolean | CardGlow;
}

const variantStyles: Record<CardVariant, string> = {
  // Primary obsidian dark card with frosted border and backdrop blur
  default:
    'bg-obsidian-900/90 text-white border border-white/[0.08] backdrop-blur-md shadow-card-dark',
  // Translucent frosted glassmorphism for floating overlays
  glass:
    'bg-white/[0.03] text-white border border-white/[0.12] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.36)]',
  // Deep ground obsidian layer
  obsidian:
    'bg-obsidian-950 text-white border border-white/[0.06] shadow-2xl',
  // Elevated higher-contrast layer
  elevated:
    'bg-obsidian-800/95 text-white border border-white/[0.12] shadow-card-hover hover:border-white/[0.2]',
  // Dark gradient for spotlight cards
  dark:
    'bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-obsidian-950 text-white border border-white/[0.08] shadow-card-dark',
  // Soft subdued card
  soft:
    'bg-obsidian-800/50 text-white/90 border border-white/[0.06] backdrop-blur-sm',
  // Outline card with clear frosted border
  outline:
    'bg-transparent text-white border border-white/[0.12]',
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
    glow === true || glow === 'orange'
      ? 'shadow-[0_0_28px_rgba(255,122,0,0.15)] border-solar-orange-500/30 hover:border-solar-orange-500/50'
      : glow === 'subtle'
        ? 'shadow-[0_0_24px_rgba(255,255,255,0.06)] border-white/[0.16]'
        : '';

  return (
    <div
      className={clsx(
        'rounded-2xl relative transition-all duration-300 ease-out',
        variantStyles[variant] || variantStyles.default,
        paddingStyles[padding],
        glowStyle,
        hover &&
          'hover:shadow-card-hover hover:-translate-y-1 hover:border-white/[0.22] cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
