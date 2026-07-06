import {
  ArrowLeft,
  Cake,
  Calendar,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, IconButton, Spinner } from '@/components/ui'
import { AppointmentRow } from '@/features/agenda/components/AppointmentRow'
import { useAppointmentsByClient } from '@/features/agenda/hooks/useAppointmentsByClient'
import { ClientFormModal } from '@/features/clients/components/ClientFormModal'
import { useClient } from '@/features/clients/hooks/useClient'
import {
  useDeleteClient,
  useUpdateClient,
} from '@/features/clients/hooks/useClientMutations'
import type { ClientFormValues } from '@/features/clients/schemas'
import { formatBirthDate, formatPhone } from '@/features/clients/utils'
import { formatFullDate } from '@/utils/date'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: client, isLoading } = useClient(id)
  const { data: appointments = [] } = useAppointmentsByClient(id)
  const [modalOpen, setModalOpen] = useState(false)

  const updateMutation = useUpdateClient()
  const deleteMutation = useDeleteClient()

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Carregando cliente" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 py-10 text-center">
        <p className="text-neutral-600 dark:text-neutral-300">
          Cliente não encontrado.
        </p>
        <Link
          to="/clientes"
          className="text-brand-600 dark:text-brand-400 text-sm font-medium"
        >
          Voltar para clientes
        </Link>
      </div>
    )
  }

  function handleUpdate(values: ClientFormValues) {
    updateMutation.mutate(
      { id: client!.id, values },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  function handleDelete() {
    if (
      !window.confirm(
        `Excluir o cliente ${client!.name}? Essa ação não pode ser desfeita.`,
      )
    ) {
      return
    }
    deleteMutation.mutate(client!.id, {
      onSuccess: () => navigate('/clientes'),
    })
  }

  const now = new Date()
  const upcoming = appointments.filter(
    (appointment) => appointment.start >= now,
  )
  const past = appointments.filter((appointment) => appointment.start < now)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Link
        to="/clientes"
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Clientes
      </Link>

      <Card className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-display flex size-12 items-center justify-center rounded-full text-lg font-semibold">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {client.name}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Cliente desde {formatFullDate(client.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <IconButton
              aria-label="Editar cliente"
              onClick={() => setModalOpen(true)}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton aria-label="Excluir cliente" onClick={handleDelete}>
              <Trash2 className="text-danger-500 size-4" aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-neutral-400" aria-hidden="true" />
            {formatPhone(client.phone)}
          </div>
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-neutral-400" aria-hidden="true" />
              {client.email}
            </div>
          )}
          {client.birthDate && (
            <div className="flex items-center gap-2">
              <Cake className="size-4 text-neutral-400" aria-hidden="true" />
              {formatBirthDate(client.birthDate)}
            </div>
          )}
          {client.notes && (
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">
              {client.notes}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="text-brand-500 size-5" aria-hidden="true" />
          <h2 className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Histórico de agendamentos
          </h2>
        </div>

        {appointments.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Nenhum agendamento registrado.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                  Próximos
                </p>
                <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
                  {upcoming.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </ul>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                  Anteriores
                </p>
                <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
                  {past.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      <ClientFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        client={client}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  )
}
