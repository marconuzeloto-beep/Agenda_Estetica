import { describe, expect, it } from 'vitest'
import { clientToFormValues } from './mappers'
import type { Client } from './types'

describe('clientToFormValues', () => {
  it('maps a client with all optional fields populated', () => {
    const client: Client = {
      id: '1',
      name: 'Maria Silva',
      phone: '11987654321',
      email: 'maria@example.com',
      birthDate: '1990-05-10',
      notes: 'Alérgica a látex',
      createdAt: new Date(2026, 0, 1),
    }

    expect(clientToFormValues(client)).toEqual({
      name: 'Maria Silva',
      phone: '11987654321',
      email: 'maria@example.com',
      birthDate: '1990-05-10',
      notes: 'Alérgica a látex',
    })
  })

  it('falls back to empty strings when optional fields are absent', () => {
    const client: Client = {
      id: '2',
      name: 'João Souza',
      phone: '11933334444',
      createdAt: new Date(2026, 0, 1),
    }

    expect(clientToFormValues(client)).toEqual({
      name: 'João Souza',
      phone: '11933334444',
      email: '',
      birthDate: '',
      notes: '',
    })
  })
})
