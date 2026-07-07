import { describe, expect, it } from 'vitest'
import { procedureToFormValues } from './mappers'
import type { Procedure } from './types'

describe('procedureToFormValues', () => {
  it('maps a procedure with notes populated', () => {
    const procedure: Procedure = {
      id: '1',
      name: 'Limpeza de pele',
      category: 'Rosto',
      durationMinutes: 60,
      price: 150,
      notes: 'Evitar em peles irritadas',
      createdAt: new Date(2026, 0, 1),
    }

    expect(procedureToFormValues(procedure)).toEqual({
      name: 'Limpeza de pele',
      category: 'Rosto',
      durationMinutes: 60,
      price: 150,
      notes: 'Evitar em peles irritadas',
    })
  })

  it('falls back to an empty string when notes are absent', () => {
    const procedure: Procedure = {
      id: '2',
      name: 'Massagem',
      category: 'Corpo',
      durationMinutes: 45,
      price: 120,
      createdAt: new Date(2026, 0, 1),
    }

    expect(procedureToFormValues(procedure).notes).toBe('')
  })
})
