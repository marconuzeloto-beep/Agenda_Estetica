import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, Input, Textarea } from '@/components/ui'
import { toDateInputValue } from '@/utils/date'
import { appointmentFormSchema, type AppointmentFormValues } from '../schemas'
import type { Appointment } from '../types'

const EMPTY_VALUES: AppointmentFormValues = {
  title: '',
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
}

export function AppointmentFormModal({
  open,
  onClose,
  initialValues,
  appointment,
  onSubmit,
  onDelete,
  isSubmitting,
}: AppointmentFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: { ...EMPTY_VALUES, ...initialValues },
  })

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
        <Input
          label="Título"
          placeholder="Ex.: Limpeza de pele"
          error={errors.title?.message}
          {...register('title')}
        />
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
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="text-danger-500"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Excluir
            </Button>
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
