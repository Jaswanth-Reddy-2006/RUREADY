import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  containerClassName?: string;
  variant?: 'light' | 'dark';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      containerClassName,
      className,
      id,
      disabled,
      variant = 'dark',
      ...props
    },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hintId = inputId && hint ? `${inputId}-hint` : undefined;
    const errorId = inputId && error ? `${inputId}-error` : undefined;
    const isLight = variant === 'light';

    return (
      <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'text-xs font-semibold uppercase tracking-wider font-display',
              isLight ? 'text-slate-700' : 'text-white/75',
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div
              className={clsx(
                'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5',
                isLight ? 'text-slate-400' : 'text-white/40',
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={clsx(
              'w-full rounded-xl border px-4 py-2.5 text-sm font-body transition-all duration-200 ease-out',
              isLight
                ? 'bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:bg-white focus:border-solar-orange-500 focus:ring-2 focus:ring-solar-orange-500/20'
                : 'bg-obsidian-900/80 text-white placeholder:text-white/35 shadow-inner backdrop-blur-sm focus:outline-none focus:bg-obsidian-900 focus:border-solar-orange-500 focus:ring-2 focus:ring-solar-orange-500/30',
              error
                ? 'border-red-500/80 text-red-400 focus:border-red-500 focus:ring-red-500/20'
                : isLight
                ? 'border-slate-200 hover:border-slate-300'
                : 'border-white/[0.12] hover:border-white/[0.24]',
              disabled && (isLight ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-50 cursor-not-allowed bg-obsidian-950/60 pointer-events-none'),
              icon && 'pl-10',
              iconRight && 'pr-10',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <div
              className={clsx(
                'absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors',
                isLight ? 'text-slate-400 hover:text-slate-600' : 'text-white/50 hover:text-white',
              )}
            >
              {iconRight}
            </div>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className={clsx('text-xs font-body mt-0.5', isLight ? 'text-slate-500' : 'text-white/50')}>
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500 font-medium font-body mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
