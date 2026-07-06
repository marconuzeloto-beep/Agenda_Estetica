import Dexie, { type Table } from 'dexie'
import type { Appointment } from '@/features/agenda/types'
import type { Client } from '@/features/clients/types'

class AgendaEsteticaDB extends Dexie {
  appointments!: Table<Appointment, string>
  clients!: Table<Client, string>

  constructor() {
    super('agenda-estetica')

    this.version(1).stores({
      appointments: 'id, start, end',
    })

    this.version(2).stores({
      appointments: 'id, start, end, clientId',
      clients: 'id, name, phone',
    })
  }
}

export const db = new AgendaEsteticaDB()
