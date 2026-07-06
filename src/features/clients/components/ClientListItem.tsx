import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPhone } from '../utils'
import type { Client } from '../types'

export interface ClientListItemProps {
  client: Client
}

export function ClientListItem({ client }: ClientListItemProps) {
  return (
    <Link
      to={`/clientes/${client.id}`}
      className="hover:border-brand-300 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition-colors dark:border-neutral-800 dark:bg-neutral-800/50"
    >
      <div className="flex items-center gap-3">
        <div className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-display flex size-10 items-center justify-center rounded-full text-sm font-semibold">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {client.name}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatPhone(client.phone)}
          </p>
        </div>
      </div>
      <ChevronRight className="size-4 text-neutral-400" aria-hidden="true" />
    </Link>
  )
}
