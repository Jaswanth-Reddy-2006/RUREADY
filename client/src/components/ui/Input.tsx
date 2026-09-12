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
      variant = 'light',
      ...props
    },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hintId = inputId && hint ? `${inputId}-hint` : undefined;
    const errorId = inputId && error ? `${inputId}-error` : undefined;

    return (
      <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#11183D] tracking-wide font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#7B8799]"
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
              'w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-sans text-[#11183D] placeholder:text-[#7B8799] shadow-sm transition-all duration-200 ease-out focus:outline-none focus:border-[#4A8BDF] focus:ring-2 focus:ring-[#4A8BDF]/20',
              error && 'border-[#D64545] text-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20',
              disabled && 'opacity-50 cursor-not-allowed bg-[#EFFAFD] pointer-events-none',
              icon && 'pl-10',
              iconRight && 'pr-10',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#7B8799]">
              {iconRight}
            </div>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="text-xs font-body text-[#7B8799] mt-0.5">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-[#D64545] font-semibold font-body mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
