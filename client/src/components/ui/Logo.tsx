import { clsx } from 'clsx';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
}
const sizeConfig = {
  xs: {
    icon: 'h-5 w-5',
    text: 'text-sm font-black tracking-widest',
    tagline: 'text-[8px]',
  },
  sm: {
    icon: 'h-7 w-7',
    text: 'text-base font-black tracking-wider',
    tagline: 'text-[8px]',
  },
  md: {
    icon: 'h-8 w-8 sm:h-9 sm:w-9',
    text: 'text-lg sm:text-xl font-black tracking-wider',
    tagline: 'text-[9px] sm:text-[10px]',
  },
  lg: {
    icon: 'h-11 w-11 sm:h-12 sm:w-12',
    text: 'text-2xl sm:text-3xl font-black tracking-wider',
    tagline: 'text-[11px] sm:text-xs',
  },
  xl: {
    icon: 'h-14 w-14 sm:h-16 sm:w-16',
    text: 'text-3xl sm:text-4xl font-black tracking-wider',
    tagline: 'text-xs sm:text-sm',
  },
};

export default function Logo({ size = 'md', theme = 'light', showTagline = false, className }: LogoProps) {
  const s = sizeConfig[size] || sizeConfig.md;
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#0F172A] dark:text-slate-100';

  return (
    <div className={clsx('flex items-center gap-2.5 select-none leading-none group cursor-pointer', className)}>
      {/* Rennetus Stylized Emblem with visible red square dot */}
      <div className={clsx('relative shrink-0 transition-transform group-hover:scale-105 p-0.5', s.icon)}>
        <img
          src="/images/rennetus-logo.png"
          alt="Rennetus Logo"
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <span className={clsx(s.text, textColor, 'font-display uppercase font-black tracking-[0.16em] leading-none')}>
            RENNETUS
          </span>
        </div>

        {showTagline && (
          <span className={clsx(s.tagline, 'font-display font-bold uppercase tracking-[0.24em] text-slate-400 mt-1')}>
            <span className="text-[#E11D48]">R</span>ECOGNIZE • <span className="text-[#E11D48]">R</span>EBUILD • <span className="text-[#E11D48]">R</span>ISE
          </span>
        )}
      </div>
    </div>
  );
}
