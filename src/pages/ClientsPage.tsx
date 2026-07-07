import { Plus, Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, Input, Spinner } from '@/components/ui'
import { PageTransition } from '@/components/layout/PageTransition'
import { ClientFormModal } from '@/features/clients/components/ClientFormModal'
import { ClientListItem } from '@/features/clients/components/ClientListItem'
import { useCreateClient } from '@/features/clients/hooks/useClientMutations'
import { useClients } from '@/features/clients/hooks/useClients'
import type { ClientFormValues } from '@/features/clients/schemas'
import { filterClients } from '@/features/clients/utils'

export function ClientsPage() {
  const { data: clients = [], isLoading } = useClients()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string>()
  const createMutation = useCreateClient()

  const filtered = useMemo(
    () => filterClients(clients, query),
    [clients, query],
  )

  function openCreateModal() {
    setSubmitError(undefined)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSubmitError(undefined)
  }

  function handleCreate(values: ClientFormValues) {
    setSubmitError(undefined)
    createMutation.mutate(values, {
      onSuccess: closeModal,
      onError: (error) => setSubmitError(error.message),
    })
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Clientes
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {clients.length} cadastrado{clients.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button size="sm" onClick={openCreateModal}>
          <Plus className="size-4" aria-hidden="true" />
          Novo cliente
        </Button>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou telefone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar clientes"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando clientes" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-neutral-500 dark:text-neutral-400">
          <Users className="size-8" aria-hidden="true" />
          <p>
            {clients.length === 0
              ? 'Nenhum cliente cadastrado ainda.'
              : 'Nenhum cliente encontrado.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((client) => (
            <ClientListItem key={client.id} client={client} />
          ))}
        </div>
      )}

      <ClientFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        error={submitError}
      />
    </PageTransition>
  )
}
