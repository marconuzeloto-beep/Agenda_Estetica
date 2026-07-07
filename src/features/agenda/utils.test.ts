import { describe, expect, it } from 'vitest'
import { filterAppointments } from './utils'
import type { Appointment } from './types'

function makeAppointment(overrides: Partial<Appointment>): Appointment {
  return {
    id: 'default-id',
    title: 'Serviço',
    start: new Date(2026, 6, 10, 9, 0),
    end: new Date(2026, 6, 10, 10, 0),
    ...overrides,
  }
}

describe('filterAppointments', () => {
  const appointments: Appointment[] = [
    makeAppointment({ id: '1', title: 'Limpeza de pele', clientId: 'a' }),
    makeAppointment({ id: '2', title: 'Massagem relaxante', clientId: 'b' }),
    makeAppointment({ id: '3', title: 'Limpeza profunda', clientId: 'a' }),
  ]

  it('returns all appointments when no filters are given', () => {
    expect(filterAppointments(appointments, {})).toHaveLength(3)
  })

  it('filters by clientId', () => {
    const result = filterAppointments(appointments, { clientId: 'a' })
    expect(result.map((a) => a.id)).toEqual(['1', '3'])
  })

  it('returns an empty array when no appointment matches the clientId', () => {
    const result = filterAppointments(appointments, { clientId: 'missing' })
    expect(result).toHaveLength(0)
  })

  it('filters by case-insensitive text search on the title', () => {
    const result = filterAppointments(appointments, { search: 'LIMPEZA' })
    expect(result.map((a) => a.id)).toEqual(['1', '3'])
  })

  it('trims the search term before matching', () => {
    const result = filterAppointments(appointments, { search: '  massagem  ' })
    expect(result.map((a) => a.id)).toEqual(['2'])
  })

  it('combines clientId and search filters', () => {
    const result = filterAppointments(appointments, {
      clientId: 'a',
      search: 'profunda',
    })
    expect(result.map((a) => a.id)).toEqual(['3'])
  })

  it('treats an empty search string as no filter', () => {
    const result = filterAppointments(appointments, { search: '' })
    expect(result).toHaveLength(3)
  })

  it('returns an empty array when the search matches nothing', () => {
    const result = filterAppointments(appointments, { search: 'inexistente' })
    expect(result).toHaveLength(0)
  })
})
