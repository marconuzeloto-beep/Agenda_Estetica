import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AppointmentFormValues } from '@/features/agenda/schemas'
import type { ProcedureFormValues } from '@/features/procedures/schemas'
import { agendaService } from './agendaService'
import { db } from '@/repositories/db'
import { proceduresService } from './proceduresService'

function makeProcedureValues(
  overrides: Partial<ProcedureFormValues> = {},
): ProcedureFormValues {
  return {
    name: 'Limpeza de pele',
    category: 'Rosto',
    durationMinutes: 60,
    price: 150,
    notes: '',
    ...overrides,
  }
}

function makeAppointmentValues(
  overrides: Partial<AppointmentFormValues> = {},
): AppointmentFormValues {
  return {
    title: 'Sessão',
    clientId: '',
    procedureId: '',
    date: '2026-07-08',
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
    ...overrides,
  }
}

beforeEach(async () => {
  await db.procedures.clear()
  await db.appointments.clear()
})

afterEach(async () => {
  await db.procedures.clear()
  await db.appointments.clear()
})

describe('proceduresService.createProcedure', () => {
  it('creates a procedure with trimmed fields', async () => {
    const procedure = await proceduresService.createProcedure(
      makeProcedureValues({ name: '  Limpeza de pele  ' }),
    )
    expect(procedure.name).toBe('Limpeza de pele')
    expect(procedure.id).toBeTruthy()
    expect(await proceduresService.listProcedures()).toHaveLength(1)
  })

  it('omits notes when left blank', async () => {
    const procedure = await proceduresService.createProcedure(makeProcedureValues())
    expect(procedure.notes).toBeUndefined()
  })
})

describe('proceduresService.updateProcedure', () => {
  it('updates an existing procedure', async () => {
    const procedure = await proceduresService.createProcedure(makeProcedureValues())
    await proceduresService.updateProcedure(
      procedure.id,
      makeProcedureValues({ price: 200 }),
    )
    const [updated] = await proceduresService.listProcedures()
    expect(updated.price).toBe(200)
  })

  it('throws when the procedure id no longer exists', async () => {
    await expect(
      proceduresService.updateProcedure('missing-id', makeProcedureValues()),
    ).rejects.toThrow('Procedimento não encontrado.')
  })
})

describe('proceduresService.deleteProcedure', () => {
  it('removes the procedure', async () => {
    const procedure = await proceduresService.createProcedure(makeProcedureValues())
    await proceduresService.deleteProcedure(procedure.id)
    expect(await proceduresService.listProcedures()).toHaveLength(0)
  })

  it('clears the procedureId of linked appointments instead of leaving an orphaned reference', async () => {
    const procedure = await proceduresService.createProcedure(makeProcedureValues())
    const appointment = await agendaService.createAppointment(
      makeAppointmentValues({ procedureId: procedure.id }),
    )

    await proceduresService.deleteProcedure(procedure.id)

    const [stored] = await agendaService.getAppointmentsInRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(stored.id).toBe(appointment.id)
    expect(stored.procedureId).toBeUndefined()
  })
})
