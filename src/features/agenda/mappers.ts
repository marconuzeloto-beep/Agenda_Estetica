import { toDateInputValue, toTimeInputValue } from '@/utils/date'
import type { AppointmentFormValues } from './schemas'
import type { Appointment } from './types'

export function appointmentToFormValues(
  appointment: Appointment,
): AppointmentFormValues {
  return {
    title: appointment.title,
    clientId: appointment.clientId ?? '',
    procedureId: appointment.procedureId ?? '',
    date: toDateInputValue(appointment.start),
    startTime: toTimeInputValue(appointment.start),
    endTime: toTimeInputValue(appointment.end),
    notes: appointment.notes ?? '',
  }
}
