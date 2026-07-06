import type { Client } from '@/features/clients/types'
import { db } from './db'

export const clientsRepository = {
  async list(): Promise<Client[]> {
    return db.clients.orderBy('name').toArray()
  },

  async get(id: string): Promise<Client | undefined> {
    return db.clients.get(id)
  },

  async create(client: Client): Promise<string> {
    return db.clients.add(client)
  },

  async update(id: string, changes: Partial<Client>): Promise<number> {
    return db.clients.update(id, changes)
  },

  async remove(id: string): Promise<void> {
    await db.clients.delete(id)
  },
}
