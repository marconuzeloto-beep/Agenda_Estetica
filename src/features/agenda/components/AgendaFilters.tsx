import { Search } from 'lucide-react'
import { Input, Select } from '@/components/ui'
import { useClients } from '@/features/clients/hooks/useClients'

export interface AgendaFiltersProps {
  clientId: string
  onClientChange: (clientId: string) => void
  search: string
  onSearchChange: (search: string) => void
}

export function AgendaFilters({
  clientId,
  onClientChange,
  search,
  onSearchChange,
}: AgendaFiltersProps) {
  const { data: clients = [] } = useClients()
  const hasActiveFilters = Boolean(clientId) || Boolean(search)

  function handleClear() {
    onClientChange('')
    onSearchChange('')
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Buscar por serviço"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar por serviço"
        />
      </div>
      <Select
        value={clientId}
        onChange={(event) => onClientChange(event.target.value)}
        aria-label="Filtrar por cliente"
        className="sm:w-56"
      >
        <option value="">Todos os clientes</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="text-sm whitespace-nowrap text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
