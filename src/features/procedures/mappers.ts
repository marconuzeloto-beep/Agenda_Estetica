import type { ProcedureFormValues } from './schemas'
import type { Procedure } from './types'

export function procedureToFormValues(
  procedure: Procedure,
): ProcedureFormValues {
  return {
    name: procedure.name,
    category: procedure.category,
    durationMinutes: procedure.durationMinutes,
    price: procedure.price,
    notes: procedure.notes ?? '',
  }
}
