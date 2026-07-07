import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, Input, Select, Textarea } from '@/components/ui'
import { useClients } from '@/features/clients/hooks/useClients'
import { useProcedures } from '@/features/procedures/hooks/useProcedures'
import { formatCurrency } from '@/utils/currency'
import { toDateInputValue } from '@/utils/date'
import { appointmentFormSchema, type AppointmentFormValues } from '../schemas'
import type { Appointment } from '../types'

const EMPTY_VALUES: AppointmentFormValues = {
  title: '',
  clientId: '',
  procedureId: '',
  date: toDateInputValue(new Date()),
  startTime: '09:00',
  endTime: '10:00',
  notes: '',
}

export interface AppointmentFormModalProps {
  open: boolean
  onClose: () => void
  initialValues?: Partial<AppointmentFormValues>
  appointment?: Appointment
  onSubmit: (values: AppointmentFormValues) => void
  onDelete?: () => void
  isSubmitting?: boolean
  error?: string
}

export function AppointmentFormModal({
  open,
  onClose,
  initialValues,
  appointment,
  onSubmit,
  onDelete,
  isSubmitting,
  error,
}: AppointmentFormModalProps) {
  const { data: clients = [] } = useClients()
  const { data: procedures = [] } = useProcedures()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: { ...EMPTY_VALUES, ...initialValues },
  })

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  // Reset the delete-confirmation step when the dialog transitions closed -> open.
  // Adjusted during render (not in an effect) per React's guidance for resetting
  // state in response to a prop change.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setConfirmingDelete(false)
  }

  useEffect(() => {
    if (open) {
      reset({ ...EMPTY_VALUES, ...initialValues })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={appointment ? 'Editar agendamento' : 'Novo agendamento'}
    >
      <form
        onSubmit={handleSubmit((values) => onSubmit(values))}
        className="flex flex-col gap-4"
      >
        {error && (
          <div
            role="alert"
            className="bg-danger-500/10 text-danger-600 dark:text-danger-400 flex items-start gap-2 rounded-md px-3 py-2 text-sm"
          >
            <TriangleAlert
              className="mt-0.5 size-4 flex-none"
              aria-hidden="true"
            />
            {error}
          </div>
        )}
        <Input
          label="Serviço"
          placeholder="Ex.: Limpeza de pele"
          error={errors.title?.message}
          {...register('title')}
        />
        <Select label="Cliente (opcional)" {...register('clientId')}>
          <option value="">Nenhum vínculo</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
        <Select label="Procedimento (opcional)" {...register('procedureId')}>
          <option value="">Nenhum vínculo</option>
          {procedures.map((procedure) => (
            <option key={procedure.id} value={procedure.id}>
              {procedure.name} — {formatCurrency(procedure.price)}
            </option>
          ))}
        </Select>
        <Input
          label="Data"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Início"
            type="time"
            error={errors.startTime?.message}
            {...register('startTime')}
          />
          <Input
            label="Término"
            type="time"
            error={errors.endTime?.message}
            {...register('endTime')}
          />
        </div>
        <Textarea
          label="Observações"
          placeholder="Opcional"
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          {appointment && onDelete ? (
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Confirmar exclusão?
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Não
                </Button>
                <Button type="button" variant="danger" onClick={onDelete}>
                  Sim, excluir
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDelete(true)}
                className="text-danger-600 dark:text-danger-400"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Excluir
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}
