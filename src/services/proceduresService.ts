import type { ProcedureFormValues } from '@/features/procedures/schemas'
import type { Procedure } from '@/features/procedures/types'
import { appointmentsRepository } from '@/repositories/appointmentsRepository'
import { proceduresRepository } from '@/repositories/proceduresRepository'

export const proceduresService = {
  listProcedures(): Promise<Procedure[]> {
    return proceduresRepository.list()
  },

  async createProcedure(values: ProcedureFormValues): Promise<Procedure> {
    const procedure: Procedure = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      category: values.category.trim(),
      durationMinutes: values.durationMinutes,
      price: values.price,
      notes: values.notes?.trim() || undefined,
      createdAt: new Date(),
    }
    await proceduresRepository.create(procedure)
    return procedure
  },

  async updateProcedure(
    id: string,
    values: ProcedureFormValues,
  ): Promise<void> {
    const updated = await proceduresRepository.update(id, {
      name: values.name.trim(),
      category: values.category.trim(),
      durationMinutes: values.durationMinutes,
      price: values.price,
      notes: values.notes?.trim() || undefined,
    })
    if (updated === 0) {
      throw new Error('Procedimento não encontrado.')
    }
  },

  async deleteProcedure(id: string): Promise<void> {
    await appointmentsRepository.clearProcedureReference(id)
    await proceduresRepository.remove(id)
  },
}
