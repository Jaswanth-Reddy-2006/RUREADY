import { clsx } from 'clsx';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  className?: string;
}

const sizeMap = {
  sm: { ru: 'text-base sm:text-lg', ready: 'text-sm sm:text-base', qMark: 'text-sm sm:text-base' },
  md: { ru: 'text-xl sm:text-2xl', ready: 'text-lg sm:text-xl', qMark: 'text-lg sm:text-xl' },
  lg: { ru: 'text-3xl sm:text-4xl', ready: 'text-2xl sm:text-3xl', qMark: 'text-2xl sm:text-3xl' },
};

export default function Logo({ size = 'md', theme = 'light', className }: LogoProps) {
  const s = sizeMap[size];
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const qMarkColor = isDark ? 'text-amber-200' : 'text-[#FF7A00]';

  return (
    <div
      className={clsx(
        'flex flex-col leading-none font-display font-black select-none tracking-tight',
        className,
      )}
    >
      <span className={clsx(s.ru, textColor)}>
        RU
      </span>
      <span className={clsx(s.ready, 'flex items-baseline')}>
        <span className={textColor}>READY</span>
        <span className={clsx(s.qMark, qMarkColor, 'ml-0.5 animate-pulse-subtle')}>
          ?
        </span>
      </span>
    </div>
  );
}
