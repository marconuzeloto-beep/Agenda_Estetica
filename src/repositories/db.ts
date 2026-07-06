import Dexie, { type Table } from 'dexie'
import type { Appointment } from '@/features/agenda/types'

class AgendaEsteticaDB extends Dexie {
  appointments!: Table<Appointment, string>

  constructor() {
    super('agenda-estetica')

    this.version(1).stores({
      appointments: 'id, start, end',
    })
  }
}

export const db = new AgendaEsteticaDB()
