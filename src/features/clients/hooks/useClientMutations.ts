import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ClientFormValues } from '@/features/clients/schemas'
import { clientsService } from '@/services/clientsService'

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ClientFormValues) =>
      clientsService.createClient(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ClientFormValues }) =>
      clientsService.updateClient(id, values),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['clients', id] })
      queryClient.invalidateQueries({ queryKey: ['clients'], exact: true })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
