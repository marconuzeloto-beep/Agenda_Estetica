import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400',
            'focus-visible:ring-brand-400 focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:outline-none',
            'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
            error && 'border-danger-500 focus-visible:ring-danger-500',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-danger-500 text-sm">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
