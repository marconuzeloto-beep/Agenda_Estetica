import type { AppointmentFormValues } from '@/features/agenda/schemas'
import type { Appointment } from '@/features/agenda/types'
import { appointmentsRepository } from '@/repositories/appointmentsRepository'
import { formatTime } from '@/utils/date'

function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

async function assertNoConflict(
  start: Date,
  end: Date,
  excludeId?: string,
): Promise<void> {
  const conflict = await appointmentsRepository.findOverlapping(
    start,
    end,
    excludeId,
  )
  if (conflict) {
    throw new Error(
      `Conflito de horário com "${conflict.title}" (${formatTime(conflict.start)} – ${formatTime(conflict.end)})`,
    )
  }
}

export const agendaService = {
  getAppointmentsInRange(start: Date, end: Date): Promise<Appointment[]> {
    return appointmentsRepository.listByRange(start, end)
  },

  getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return appointmentsRepository.listByClient(clientId)
  },

  async createAppointment(values: AppointmentFormValues): Promise<Appointment> {
    const start = combineDateAndTime(values.date, values.startTime)
    const end = combineDateAndTime(values.date, values.endTime)

    await assertNoConflict(start, end)

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      clientId: values.clientId || undefined,
      procedureId: values.procedureId || undefined,
      start,
      end,
      notes: values.notes?.trim() || undefined,
    }
    await appointmentsRepository.create(appointment)
    return appointment
  },

  async updateAppointment(
    id: string,
    values: AppointmentFormValues,
  ): Promise<void> {
    const start = combineDateAndTime(values.date, values.startTime)
    const end = combineDateAndTime(values.date, values.endTime)

    await assertNoConflict(start, end, id)

    await appointmentsRepository.update(id, {
      title: values.title.trim(),
      clientId: values.clientId || undefined,
      procedureId: values.procedureId || undefined,
      start,
      end,
      notes: values.notes?.trim() || undefined,
    })
  },

  deleteAppointment(id: string): Promise<void> {
    return appointmentsRepository.remove(id)
  },
}
