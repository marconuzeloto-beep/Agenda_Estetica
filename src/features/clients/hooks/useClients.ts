import { useQuery } from '@tanstack/react-query'
import { clientsService } from '@/services/clientsService'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.listClients(),
  })
}
