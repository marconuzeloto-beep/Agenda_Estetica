import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button, IconButton, Tabs } from '@/components/ui'
import type { AgendaView } from '../types'

const VIEW_ITEMS: { value: AgendaView; label: string }[] = [
  { value: 'day', label: 'Dia' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
]

export interface AgendaToolbarProps {
  view: AgendaView
  periodLabel: string
  onViewChange: (view: AgendaView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onCreate: () => void
}

export function AgendaToolbar({
  view,
  periodLabel,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreate,
}: AgendaToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <IconButton aria-label="Período anterior" onClick={onPrev}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </IconButton>
        <Button variant="outline" size="sm" onClick={onToday}>
          Hoje
        </Button>
        <IconButton aria-label="Próximo período" onClick={onNext}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </IconButton>
        <span className="font-display ml-1 text-sm font-semibold text-neutral-800 sm:text-base dark:text-neutral-100">
          {periodLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Tabs items={VIEW_ITEMS} value={view} onChange={onViewChange} />
        <Button size="sm" onClick={onCreate}>
          <Plus className="size-4" aria-hidden="true" />
          Novo
        </Button>
      </div>
    </div>
  )
}
