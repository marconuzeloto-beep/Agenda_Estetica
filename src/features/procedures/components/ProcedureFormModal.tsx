import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, Input, Textarea } from '@/components/ui'
import { useResetFormOnOpen } from '@/hooks/useResetFormOnOpen'
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
  error?: string
}

export function ProcedureFormModal({
  open,
  onClose,
  procedure,
  onSubmit,
  isSubmitting,
  error,
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

  useResetFormOnOpen(
    open,
    reset,
    procedure ? procedureToFormValues(procedure) : EMPTY_VALUES,
  )

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
