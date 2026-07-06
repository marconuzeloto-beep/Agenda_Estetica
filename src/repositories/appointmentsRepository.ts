import type { Appointment } from '@/features/agenda/types'
import { db } from './db'

export const appointmentsRepository = {
  async listByRange(start: Date, end: Date): Promise<Appointment[]> {
    const all = await db.appointments.toArray()
    return all.filter(
      (appointment) => appointment.start <= end && appointment.end >= start,
    )
  },

  async listByClient(clientId: string): Promise<Appointment[]> {
    const appointments = await db.appointments
      .where('clientId')
      .equals(clientId)
      .toArray()
    return appointments.sort((a, b) => b.start.getTime() - a.start.getTime())
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

  async clearClientReference(clientId: string): Promise<void> {
    await db.appointments
      .where('clientId')
      .equals(clientId)
      .modify({ clientId: undefined })
  },
}
