import type { Procedure } from '@/features/procedures/types'
import { db } from './db'

export const proceduresRepository = {
  async list(): Promise<Procedure[]> {
    return db.procedures.orderBy('name').toArray()
  },

  async get(id: string): Promise<Procedure | undefined> {
    return db.procedures.get(id)
  },

  async create(procedure: Procedure): Promise<string> {
    return db.procedures.add(procedure)
  },

  async update(id: string, changes: Partial<Procedure>): Promise<number> {
    return db.procedures.update(id, changes)
  },

  async remove(id: string): Promise<void> {
    await db.procedures.delete(id)
  },
}
