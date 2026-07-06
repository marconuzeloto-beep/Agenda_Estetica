import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, Input, Textarea } from '@/components/ui'
import { SUGGESTED_CATEGORIES } from '../constants'
import { useProcedures } from '../hooks/useProcedures'
import { procedureToFormValues } from '../mappers'
import { procedureFormSchema, type ProcedureFormValues } from '../schemas'
import type { Procedure } from '../types'

const EMPTY_VALUES: ProcedureFormValues = {
  name: '',
  category: '',
  durationMinutes: 30,
  price: 0,
  notes: '',
}

const CATEGORY_DATALIST_ID = 'procedure-categories'

export interface ProcedureFormModalProps {
  open: boolean
  onClose: () => void
  procedure?: Procedure
  onSubmit: (values: ProcedureFormValues) => void
  isSubmitting?: boolean
}

export function ProcedureFormModal({
  open,
  onClose,
  procedure,
  onSubmit,
  isSubmitting,
}: ProcedureFormModalProps) {
  const { data: procedures = [] } = useProcedures()

  const categoryOptions = useMemo(() => {
    const existing = procedures.map((item) => item.category)
    return Array.from(new Set([...SUGGESTED_CATEGORIES, ...existing])).sort()
  }, [procedures])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProcedureFormValues>({
    resolver: zodResolver(procedureFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(procedure ? procedureToFormValues(procedure) : EMPTY_VALUES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, procedure])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={procedure ? 'Editar procedimento' : 'Novo procedimento'}
    >
      <form
        onSubmit={handleSubmit((values) => onSubmit(values))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nome"
          placeholder="Ex.: Limpeza de pele"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Categoria"
          list={CATEGORY_DATALIST_ID}
          placeholder="Ex.: Rosto"
          error={errors.category?.message}
          {...register('category')}
        />
        <datalist id={CATEGORY_DATALIST_ID}>
          {categoryOptions.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Duração (min)"
            type="number"
            min={5}
            step={5}
            error={errors.durationMinutes?.message}
            {...register('durationMinutes', { valueAsNumber: true })}
          />
          <Input
            label="Preço (R$)"
            type="number"
            min={0}
            step={0.01}
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
        </div>
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
