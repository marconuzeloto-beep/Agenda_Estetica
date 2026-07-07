import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Appointment } from '@/features/agenda/types'
import { appointmentsRepository } from './appointmentsRepository'
import { db } from './db'

function makeAppointment(overrides: Partial<Appointment>): Appointment {
  return {
    id: 'default-id',
    title: 'Serviço',
    start: new Date(2026, 6, 8, 9, 0),
    end: new Date(2026, 6, 8, 10, 0),
    ...overrides,
  }
}

beforeEach(async () => {
  await db.appointments.clear()
})

afterEach(async () => {
  await db.appointments.clear()
})

describe('appointmentsRepository.create / listByRange', () => {
  it('creates an appointment and finds it within an overlapping range', async () => {
    const appointment = makeAppointment({ id: '1' })
    await appointmentsRepository.create(appointment)

    const result = await appointmentsRepository.listByRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )

    expect(result.map((a) => a.id)).toEqual(['1'])
  })

  it('excludes appointments entirely outside the range', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))

    const result = await appointmentsRepository.listByRange(
      new Date(2026, 6, 9, 0, 0),
      new Date(2026, 6, 9, 23, 59),
    )

    expect(result).toHaveLength(0)
  })

  it('includes appointments that only partially overlap the range', async () => {
    await appointmentsRepository.create(
      makeAppointment({
        id: '1',
        start: new Date(2026, 6, 8, 23, 0),
        end: new Date(2026, 6, 9, 1, 0),
      }),
    )

    const result = await appointmentsRepository.listByRange(
      new Date(2026, 6, 9, 0, 0),
      new Date(2026, 6, 9, 23, 59),
    )

    expect(result.map((a) => a.id)).toEqual(['1'])
  })

  it('returns an empty array when there are no appointments at all', async () => {
    const result = await appointmentsRepository.listByRange(
      new Date(2026, 0, 1),
      new Date(2026, 11, 31),
    )
    expect(result).toEqual([])
  })
})

describe('appointmentsRepository.listByClient', () => {
  it('returns only appointments for the given client, most recent first', async () => {
    await appointmentsRepository.create(
      makeAppointment({ id: '1', clientId: 'client-a', start: new Date(2026, 6, 1, 9, 0) }),
    )
    await appointmentsRepository.create(
      makeAppointment({ id: '2', clientId: 'client-a', start: new Date(2026, 6, 10, 9, 0) }),
    )
    await appointmentsRepository.create(
      makeAppointment({ id: '3', clientId: 'client-b', start: new Date(2026, 6, 5, 9, 0) }),
    )

    const result = await appointmentsRepository.listByClient('client-a')
    expect(result.map((a) => a.id)).toEqual(['2', '1'])
  })

  it('returns an empty array for a client with no appointments', async () => {
    const result = await appointmentsRepository.listByClient('nobody')
    expect(result).toEqual([])
  })
})

describe('appointmentsRepository.findOverlapping', () => {
  it('finds an appointment that overlaps the given time range', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))

    const conflict = await appointmentsRepository.findOverlapping(
      new Date(2026, 6, 8, 9, 30),
      new Date(2026, 6, 8, 10, 30),
    )

    expect(conflict?.id).toBe('1')
  })

  it('returns undefined when there is no overlap', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))

    const conflict = await appointmentsRepository.findOverlapping(
      new Date(2026, 6, 8, 10, 0),
      new Date(2026, 6, 8, 11, 0),
    )

    expect(conflict).toBeUndefined()
  })

  it('excludes the given id from the conflict search (editing itself)', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))

    const conflict = await appointmentsRepository.findOverlapping(
      new Date(2026, 6, 8, 9, 0),
      new Date(2026, 6, 8, 10, 0),
      '1',
    )

    expect(conflict).toBeUndefined()
  })
})

describe('appointmentsRepository.update', () => {
  it('updates an existing appointment and returns a count of 1', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))

    const count = await appointmentsRepository.update('1', { title: 'Novo título' })
    expect(count).toBe(1)

    const [updated] = await appointmentsRepository.listByRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(updated.title).toBe('Novo título')
  })

  it('returns 0 when updating an id that does not exist', async () => {
    const count = await appointmentsRepository.update('missing', {
      title: 'x',
    })
    expect(count).toBe(0)
  })
})

describe('appointmentsRepository.remove', () => {
  it('deletes an existing appointment', async () => {
    await appointmentsRepository.create(makeAppointment({ id: '1' }))
    await appointmentsRepository.remove('1')

    const result = await appointmentsRepository.listByRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(result).toHaveLength(0)
  })

  it('does not throw when removing an id that does not exist', async () => {
    await expect(appointmentsRepository.remove('missing')).resolves.toBeUndefined()
  })
})

describe('appointmentsRepository.clearClientReference', () => {
  it('clears clientId only on appointments linked to that client', async () => {
    await appointmentsRepository.create(
      makeAppointment({ id: '1', clientId: 'client-a' }),
    )
    await appointmentsRepository.create(
      makeAppointment({ id: '2', clientId: 'client-b' }),
    )

    await appointmentsRepository.clearClientReference('client-a')

    const all = await appointmentsRepository.listByRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    const first = all.find((a) => a.id === '1')
    const second = all.find((a) => a.id === '2')
    expect(first?.clientId).toBeUndefined()
    expect(second?.clientId).toBe('client-b')
  })

  it('is a no-op when no appointment references the client', async () => {
    await expect(
      appointmentsRepository.clearClientReference('nobody'),
    ).resolves.toBeUndefined()
  })
})

describe('appointmentsRepository.clearProcedureReference', () => {
  it('clears procedureId only on appointments linked to that procedure', async () => {
    await appointmentsRepository.create(
      makeAppointment({ id: '1', procedureId: 'proc-a' }),
    )
    await appointmentsRepository.create(
      makeAppointment({ id: '2', procedureId: 'proc-b' }),
    )

    await appointmentsRepository.clearProcedureReference('proc-a')

    const all = await appointmentsRepository.listByRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    const first = all.find((a) => a.id === '1')
    const second = all.find((a) => a.id === '2')
    expect(first?.procedureId).toBeUndefined()
    expect(second?.procedureId).toBe('proc-b')
  })
})
