import { describe, expect, it } from 'vitest'
import { procedureFormSchema } from './schemas'

const validValues = {
  name: 'Limpeza de pele',
  category: 'Rosto',
  durationMinutes: 60,
  price: 150,
  notes: '',
}

describe('procedureFormSchema', () => {
  it('accepts valid values', () => {
    expect(procedureFormSchema.safeParse(validValues).success).toBe(true)
  })

  it('trims the name and category', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      name: '  Limpeza de pele  ',
      category: '  Rosto  ',
    })
    expect(result.success).toBe(true)
    expect(result.success && result.data.name).toBe('Limpeza de pele')
    expect(result.success && result.data.category).toBe('Rosto')
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = procedureFormSchema.safeParse({ ...validValues, name: 'L' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty category', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      category: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a duration below 5 minutes', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      durationMinutes: 4,
    })
    expect(result.success).toBe(false)
  })

  it('accepts the minimum duration boundary of 5 minutes', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      durationMinutes: 5,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a duration above 480 minutes', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      durationMinutes: 481,
    })
    expect(result.success).toBe(false)
  })

  it('accepts the maximum duration boundary of 480 minutes', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      durationMinutes: 480,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a negative price', () => {
    const result = procedureFormSchema.safeParse({
      ...validValues,
      price: -1,
    })
    expect(result.success).toBe(false)
  })

  it('accepts a price of zero', () => {
    const result = procedureFormSchema.safeParse({ ...validValues, price: 0 })
    expect(result.success).toBe(true)
  })

  it('accepts a missing notes field', () => {
    const result = procedureFormSchema.safeParse({
      name: 'Limpeza de pele',
      category: 'Rosto',
      durationMinutes: 60,
      price: 150,
    })
    expect(result.success).toBe(true)
  })
})
