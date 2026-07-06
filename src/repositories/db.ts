import Dexie, { type Table } from 'dexie'
import type { Appointment } from '@/features/agenda/types'
import type { Client } from '@/features/clients/types'
import type { Procedure } from '@/features/procedures/types'

class AgendaEsteticaDB extends Dexie {
  appointments!: Table<Appointment, string>
  clients!: Table<Client, string>
  procedures!: Table<Procedure, string>

  constructor() {
    super('agenda-estetica')

    this.version(1).stores({
      appointments: 'id, start, end',
    })

    this.version(2).stores({
      appointments: 'id, start, end, clientId',
      clients: 'id, name, phone',
    })

    this.version(3).stores({
      appointments: 'id, start, end, clientId',
      clients: 'id, name, phone',
      procedures: 'id, name, category',
    })

    this.version(4).stores({
      appointments: 'id, start, end, clientId, procedureId',
      clients: 'id, name, phone',
      procedures: 'id, name, category',
    })
  }
}

export const db = new AgendaEsteticaDB()
