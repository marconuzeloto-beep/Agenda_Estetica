import { Pencil, Trash2 } from 'lucide-react'
import { Card, IconButton } from '@/components/ui'
import { formatCurrency, formatDuration } from '../utils'
import type { Procedure } from '../types'

export interface ProcedureCardProps {
  procedure: Procedure
  onEdit: () => void
  onDelete: () => void
}

export function ProcedureCard({
  procedure,
  onEdit,
  onDelete,
}: ProcedureCardProps) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {procedure.name}
          </p>
          <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 rounded-full px-2 py-0.5 text-xs font-medium">
            {procedure.category}
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDuration(procedure.durationMinutes)} ·{' '}
          {formatCurrency(procedure.price)}
        </p>
        {procedure.notes && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {procedure.notes}
          </p>
        )}
      </div>
      <div className="flex flex-none gap-1">
        <IconButton aria-label={`Editar ${procedure.name}`} onClick={onEdit}>
          <Pencil className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={`Excluir ${procedure.name}`} onClick={onDelete}>
          <Trash2 className="text-danger-500 size-4" aria-hidden="true" />
        </IconButton>
      </div>
    </Card>
  )
}
