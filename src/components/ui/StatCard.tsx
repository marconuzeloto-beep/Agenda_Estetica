import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card } from './Card'

const accentClasses = {
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
  success: 'bg-success-500/10 text-success-500',
  warning: 'bg-warning-500/10 text-warning-500',
} as const

export interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: keyof typeof accentClasses
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'brand',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex size-11 flex-none items-center justify-center rounded-full',
          accentClasses[accent],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {value}
        </p>
        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
    </Card>
  )
}
