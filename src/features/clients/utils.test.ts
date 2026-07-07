import { describe, expect, it } from 'vitest'
import { filterClients, formatBirthDate, formatPhone } from './utils'
import type { Client } from './types'

function makeClient(overrides: Partial<Client>): Client {
  return {
    id: 'default-id',
    name: 'Cliente',
    phone: '11999999999',
    createdAt: new Date(2026, 0, 1),
    ...overrides,
  }
}

describe('filterClients', () => {
  const clients: Client[] = [
    makeClient({ id: '1', name: 'Maria Silva', phone: '11987654321' }),
    makeClient({ id: '2', name: 'João Souza', phone: '11933334444' }),
  ]

  it('returns all clients when the query is empty', () => {
    expect(filterClients(clients, '')).toHaveLength(2)
  })

  it('returns all clients when the query is only whitespace', () => {
    expect(filterClients(clients, '   ')).toHaveLength(2)
  })

  it('filters by case-insensitive name match', () => {
    const result = filterClients(clients, 'maria')
    expect(result.map((c) => c.id)).toEqual(['1'])
  })

  it('filters by phone digits, ignoring punctuation in the query', () => {
    const result = filterClients(clients, '(11) 98765-4321')
    expect(result.map((c) => c.id)).toEqual(['1'])
  })

  it('filters by partial phone digits', () => {
    const result = filterClients(clients, '9333')
    expect(result.map((c) => c.id)).toEqual(['2'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterClients(clients, 'inexistente')).toHaveLength(0)
  })
})

describe('formatPhone', () => {
  it('formats an 11-digit mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formats a 10-digit landline number', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('returns the original string when digit count is unexpected', () => {
    expect(formatPhone('123')).toBe('123')
  })

  it('strips existing punctuation before formatting', () => {
    expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
  })
})

describe('formatBirthDate', () => {
  it('converts yyyy-mm-dd to dd/mm/yyyy', () => {
    expect(formatBirthDate('1990-05-10')).toBe('10/05/1990')
  })

  it('returns the original string when a date part is missing', () => {
    expect(formatBirthDate('1990-05')).toBe('1990-05')
  })

  it('returns the original string for an empty value', () => {
    expect(formatBirthDate('')).toBe('')
  })
})
