import type { CSSProperties } from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseStyle: CSSProperties = {
    width: width ?? '100%',
    height:
      height ??
      (variant === 'text' ? '1rem' : variant === 'circular' ? (width ?? '2.5rem') : '100%'),
  };

  const skeletonBaseClasses = clsx(
    'relative overflow-hidden bg-obsidian-800/80 border border-white/[0.04]',
    'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]',
    'before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent',
    'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite]',
    'after:bg-gradient-to-r after:from-transparent after:via-solar-orange-500/[0.06] after:to-transparent',
  );

  if (lines > 1 && variant === 'text') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading content"
        className={clsx('flex flex-col gap-2.5', className)}
      >
        <span className="sr-only">Loading...</span>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(skeletonBaseClasses, 'rounded-md')}
            style={{
              ...baseStyle,
              width: i === lines - 1 ? '70%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading content"
      className={clsx(
        skeletonBaseClasses,
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-md',
        variant === 'rectangular' && 'rounded-xl',
        className,
      )}
      style={baseStyle}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
