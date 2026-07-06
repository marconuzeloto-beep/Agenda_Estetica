import { useQuery } from '@tanstack/react-query'
import { proceduresService } from '@/services/proceduresService'

export function useProcedures() {
  return useQuery({
    queryKey: ['procedures'],
    queryFn: () => proceduresService.listProcedures(),
  })
}
