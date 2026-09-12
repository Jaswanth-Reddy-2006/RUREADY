import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'royal'
  | 'secondary'
  | 'ai'
  | 'eggplant'
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
    'bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-semibold shadow-sm active:scale-[0.98] border border-transparent',
  royal:
    'bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-semibold shadow-sm active:scale-[0.98] border border-transparent',
  secondary:
    'bg-white text-[#4A8BDF] font-semibold border border-[#DCE7F2] hover:bg-[#EFFAFD] hover:border-[#4A8BDF] active:scale-[0.98] shadow-sm',
  ai:
    'bg-[#A0006D] hover:bg-[#780052] text-white font-semibold shadow-sm active:scale-[0.98] border border-transparent',
  eggplant:
    'bg-[#A0006D] hover:bg-[#780052] text-white font-semibold shadow-sm active:scale-[0.98] border border-transparent',
  outline:
    'bg-transparent text-[#4A8BDF] font-semibold border border-[#4A8BDF] hover:bg-[#EFFAFD] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD] active:scale-[0.98] font-medium',
  danger:
    'bg-[#D64545] hover:bg-[#B91C1C] text-white font-semibold border border-transparent active:scale-[0.98] shadow-sm',
  glass:
    'bg-white text-[#11183D] font-semibold border border-[#DCE7F2] hover:bg-[#EFFAFD] active:scale-[0.98] shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs min-h-[36px] rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm min-h-[42px] rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base min-h-[48px] rounded-xl gap-2.5',
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
          'inline-flex items-center justify-center font-sans transition-all duration-200 ease-out select-none cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF] focus-visible:ring-offset-2',
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
