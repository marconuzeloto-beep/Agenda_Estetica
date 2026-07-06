import { useQuery } from '@tanstack/react-query'
import { agendaService } from '@/services/agendaService'

export function useAppointmentsRange(start: Date, end: Date) {
  return useQuery({
    queryKey: ['appointments', start.getTime(), end.getTime()],
    queryFn: () => agendaService.getAppointmentsInRange(start, end),
  })
}
