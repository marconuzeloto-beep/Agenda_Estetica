import { ChevronDown } from 'lucide-react'
import { type SelectHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              'h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white px-3 pr-9 text-sm text-neutral-900',
              'focus-visible:border-brand-400 focus-visible:ring-brand-400 focus-visible:ring-2 focus-visible:outline-none',
              'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
              error && 'border-danger-500 focus-visible:ring-danger-500',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
        </div>
        {error && <p className="text-danger-500 text-sm">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
