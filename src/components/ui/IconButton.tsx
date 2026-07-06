import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

const variantClasses = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  ghost:
    'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
} as const

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full transition-colors',
        'focus-visible:ring-brand-400 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
)

IconButton.displayName = 'IconButton'
