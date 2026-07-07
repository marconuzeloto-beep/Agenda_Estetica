import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AppointmentFormValues } from '@/features/agenda/schemas'
import { db } from '@/repositories/db'
import { agendaService } from './agendaService'

function makeValues(overrides: Partial<AppointmentFormValues> = {}): AppointmentFormValues {
  return {
    title: 'Limpeza de pele',
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
  await db.appointments.clear()
})

afterEach(async () => {
  await db.appointments.clear()
})

describe('agendaService.createAppointment', () => {
  it('creates an appointment with trimmed fields and combined date/time', async () => {
    const appointment = await agendaService.createAppointment(
      makeValues({ title: '  Limpeza de pele  ', notes: '  Pele sensível  ' }),
    )

    expect(appointment.title).toBe('Limpeza de pele')
    expect(appointment.notes).toBe('Pele sensível')
    expect(appointment.start.getHours()).toBe(9)
    expect(appointment.end.getHours()).toBe(10)
    expect(appointment.id).toBeTruthy()

    const stored = await agendaService.getAppointmentsInRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(stored).toHaveLength(1)
  })

  it('omits optional fields when left blank', async () => {
    const appointment = await agendaService.createAppointment(makeValues())
    expect(appointment.clientId).toBeUndefined()
    expect(appointment.procedureId).toBeUndefined()
    expect(appointment.notes).toBeUndefined()
  })

  it('rejects a new appointment that overlaps an existing one', async () => {
    await agendaService.createAppointment(makeValues())

    await expect(
      agendaService.createAppointment(
        makeValues({ startTime: '09:30', endTime: '10:30' }),
      ),
    ).rejects.toThrow(/Conflito de horário/)
  })

  it('allows a new appointment that is adjacent but not overlapping', async () => {
    await agendaService.createAppointment(makeValues())

    await expect(
      agendaService.createAppointment(
        makeValues({ startTime: '10:00', endTime: '11:00' }),
      ),
    ).resolves.toBeDefined()
  })
})

describe('agendaService.updateAppointment', () => {
  it('updates an existing appointment', async () => {
    const created = await agendaService.createAppointment(makeValues())

    await agendaService.updateAppointment(
      created.id,
      makeValues({ title: 'Novo título' }),
    )

    const [updated] = await agendaService.getAppointmentsInRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(updated.title).toBe('Novo título')
  })

  it('allows editing an appointment without conflicting with itself', async () => {
    const created = await agendaService.createAppointment(makeValues())

    await expect(
      agendaService.updateAppointment(created.id, makeValues({ title: 'Ajustado' })),
    ).resolves.toBeUndefined()
  })

  it('rejects an edit that would overlap a different appointment', async () => {
    await agendaService.createAppointment(makeValues())
    const second = await agendaService.createAppointment(
      makeValues({ startTime: '11:00', endTime: '12:00' }),
    )

    await expect(
      agendaService.updateAppointment(
        second.id,
        makeValues({ startTime: '09:30', endTime: '10:30' }),
      ),
    ).rejects.toThrow(/Conflito de horário/)
  })

  it('throws when the appointment id no longer exists', async () => {
    await expect(
      agendaService.updateAppointment('missing-id', makeValues()),
    ).rejects.toThrow('Agendamento não encontrado.')
  })
})

describe('agendaService.deleteAppointment', () => {
  it('removes the appointment', async () => {
    const created = await agendaService.createAppointment(makeValues())
    await agendaService.deleteAppointment(created.id)

    const stored = await agendaService.getAppointmentsInRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(stored).toHaveLength(0)
  })
})

describe('agendaService.getAppointmentsByClient', () => {
  it('returns only appointments for the given client', async () => {
    await agendaService.createAppointment(makeValues({ clientId: 'client-a' }))
    await agendaService.createAppointment(
      makeValues({ clientId: 'client-b', startTime: '11:00', endTime: '12:00' }),
    )

    const result = await agendaService.getAppointmentsByClient('client-a')
    expect(result).toHaveLength(1)
    expect(result[0].clientId).toBe('client-a')
  })
})
