import type { Appointment } from '@/features/agenda/types'
import { db } from './db'

export const appointmentsRepository = {
  async listByRange(start: Date, end: Date): Promise<Appointment[]> {
    const all = await db.appointments.toArray()
    return all.filter(
      (appointment) => appointment.start <= end && appointment.end >= start,
    )
  },

  async create(appointment: Appointment): Promise<string> {
    return db.appointments.add(appointment)
  },

  async update(id: string, changes: Partial<Appointment>): Promise<number> {
    return db.appointments.update(id, changes)
  },

  async remove(id: string): Promise<void> {
    await db.appointments.delete(id)
  },
}
