import type { Appointment } from './types'

export interface AppointmentFilters {
  clientId?: string
  search?: string
}

export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilters,
): Appointment[] {
  const normalizedSearch = filters.search?.trim().toLowerCase()

  return appointments.filter((appointment) => {
    if (filters.clientId && appointment.clientId !== filters.clientId) {
      return false
    }
    if (
      normalizedSearch &&
      !appointment.title.toLowerCase().includes(normalizedSearch)
    ) {
      return false
    }
    return true
  })
}
