import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, Input, Textarea } from '@/components/ui'
import { clientToFormValues } from '../mappers'
import { clientFormSchema, type ClientFormValues } from '../schemas'
import type { Client } from '../types'

const EMPTY_VALUES: ClientFormValues = {
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  notes: '',
}

export interface ClientFormModalProps {
  open: boolean
  onClose: () => void
  client?: Client
  onSubmit: (values: ClientFormValues) => void
  isSubmitting?: boolean
}

export function ClientFormModal({
  open,
  onClose,
  client,
  onSubmit,
  isSubmitting,
}: ClientFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(client ? clientToFormValues(client) : EMPTY_VALUES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, client])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={client ? 'Editar cliente' : 'Novo cliente'}
    >
      <form
        onSubmit={handleSubmit((values) => onSubmit(values))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nome completo"
          placeholder="Ex.: Maria Silva"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Telefone"
          placeholder="(11) 98765-4321"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="Opcional"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Data de nascimento"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        <Textarea
          label="Observações"
          placeholder="Opcional"
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="mt-2 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Salvar
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
