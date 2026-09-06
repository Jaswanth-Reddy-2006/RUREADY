import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-solar-orange-500 to-solar-orange-600 hover:from-solar-orange-400 hover:to-solar-orange-500 text-white font-semibold shadow-orange hover:shadow-orange-hover hover:brightness-105 active:scale-[0.98] border border-solar-orange-400/20',
  secondary:
    'bg-obsidian-800/90 text-white font-semibold border border-white/10 hover:bg-obsidian-700/90 hover:border-white/20 active:scale-[0.98] shadow-subtle backdrop-blur-sm',
  outline:
    'bg-transparent text-white/90 font-semibold border border-white/15 hover:text-white hover:border-solar-orange-500/50 hover:bg-solar-orange-500/10 active:scale-[0.98]',
  ghost:
    'bg-transparent text-white/75 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] active:scale-[0.98] font-medium',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold border border-red-500/30 hover:shadow-red-500/20 active:scale-[0.98] shadow-subtle',
  glass:
    'bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold border border-white/[0.12] hover:border-white/[0.24] backdrop-blur-md active:scale-[0.98] shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs min-h-[36px] rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm min-h-[42px] rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base min-h-[48px] rounded-2xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconRight,
      fullWidth = false,
      className,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center font-display transition-all duration-200 ease-out select-none cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-solar-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled &&
            'opacity-50 cursor-not-allowed pointer-events-none transform-none shadow-none',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children && <span>{children}</span>}
        {iconRight && !isLoading && (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
