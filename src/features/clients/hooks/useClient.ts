import { useQuery } from '@tanstack/react-query'
import { clientsService } from '@/services/clientsService'

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => (await clientsService.getClient(id as string)) ?? null,
    enabled: Boolean(id),
  })
}
