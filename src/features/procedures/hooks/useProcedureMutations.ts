import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProcedureFormValues } from '@/features/procedures/schemas'
import { proceduresService } from '@/services/proceduresService'

export function useCreateProcedure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProcedureFormValues) =>
      proceduresService.createProcedure(values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['procedures'] }),
  })
}

export function useUpdateProcedure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProcedureFormValues }) =>
      proceduresService.updateProcedure(id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['procedures'] }),
  })
}

export function useDeleteProcedure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => proceduresService.deleteProcedure(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['procedures'] }),
  })
}
