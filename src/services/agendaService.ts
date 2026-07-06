import type { AppointmentFormValues } from '@/features/agenda/schemas'
import type { Appointment } from '@/features/agenda/types'
import { appointmentsRepository } from '@/repositories/appointmentsRepository'

function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

export const agendaService = {
  getAppointmentsInRange(start: Date, end: Date): Promise<Appointment[]> {
    return appointmentsRepository.listByRange(start, end)
  },

  async createAppointment(values: AppointmentFormValues): Promise<Appointment> {
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      start: combineDateAndTime(values.date, values.startTime),
      end: combineDateAndTime(values.date, values.endTime),
      notes: values.notes?.trim() || undefined,
    }
    await appointmentsRepository.create(appointment)
    return appointment
  },

  async updateAppointment(
    id: string,
    values: AppointmentFormValues,
  ): Promise<void> {
    await appointmentsRepository.update(id, {
      title: values.title.trim(),
      start: combineDateAndTime(values.date, values.startTime),
      end: combineDateAndTime(values.date, values.endTime),
      notes: values.notes?.trim() || undefined,
    })
  },

  deleteAppointment(id: string): Promise<void> {
    return appointmentsRepository.remove(id)
  },
}
