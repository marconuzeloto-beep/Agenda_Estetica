import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Carregando...' }: SpinnerProps) {
  return (
    <div role="status" className="inline-flex items-center gap-2">
      <Loader2
        className={cn('text-brand-500 size-5 animate-spin', className)}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
