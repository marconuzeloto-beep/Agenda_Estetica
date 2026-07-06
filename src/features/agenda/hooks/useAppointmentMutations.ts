import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AppointmentFormValues } from '@/features/agenda/schemas'
import { agendaService } from '@/services/agendaService'

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: AppointmentFormValues) =>
      agendaService.createAppointment(values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: AppointmentFormValues
    }) => agendaService.updateAppointment(id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agendaService.deleteAppointment(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}
