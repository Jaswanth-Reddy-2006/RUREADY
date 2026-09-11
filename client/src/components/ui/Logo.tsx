import { clsx } from 'clsx';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  className?: string;
}

const sizeMap = {
  sm: { text: 'text-base sm:text-lg', qMark: 'text-lg sm:text-xl' },
  md: { text: 'text-xl sm:text-2xl', qMark: 'text-2xl sm:text-3xl' },
  lg: { text: 'text-3xl sm:text-4xl', qMark: 'text-4xl sm:text-5xl' },
};

export default function Logo({ size = 'md', theme = 'light', className }: LogoProps) {
  const s = sizeMap[size];
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-950';

  return (
    <div
      className={clsx(
        'flex items-center leading-none font-display font-extrabold select-none tracking-tight gap-0.5',
        className,
      )}
    >
      <span className={clsx(s.text, textColor)}>
        R U Ready
      </span>
      <span className={clsx(s.qMark, 'text-[#F97316] font-black drop-shadow-sm animate-pulse-subtle')}>
        ?
      </span>
    </div>
  );
}
