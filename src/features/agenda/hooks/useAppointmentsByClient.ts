import { useQuery } from '@tanstack/react-query'
import { agendaService } from '@/services/agendaService'

export function useAppointmentsByClient(clientId: string | undefined) {
  return useQuery({
    queryKey: ['appointments', 'client', clientId],
    queryFn: () => agendaService.getAppointmentsByClient(clientId as string),
    enabled: Boolean(clientId),
  })
}
