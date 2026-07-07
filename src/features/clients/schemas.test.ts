import { describe, expect, it } from 'vitest'
import { clientFormSchema } from './schemas'

const validValues = {
  name: 'Maria Silva',
  phone: '(11) 98765-4321',
  email: 'maria@example.com',
  birthDate: '1990-05-10',
  notes: '',
}

describe('clientFormSchema', () => {
  it('accepts valid values', () => {
    expect(clientFormSchema.safeParse(validValues).success).toBe(true)
  })

  it('trims the name', () => {
    const result = clientFormSchema.safeParse({
      ...validValues,
      name: '  Maria Silva  ',
    })
    expect(result.success).toBe(true)
    expect(result.success && result.data.name).toBe('Maria Silva')
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = clientFormSchema.safeParse({ ...validValues, name: 'M' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty phone', () => {
    const result = clientFormSchema.safeParse({ ...validValues, phone: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a phone with fewer than 10 digits', () => {
    const result = clientFormSchema.safeParse({
      ...validValues,
      phone: '123456789',
    })
    expect(result.success).toBe(false)
  })

  it('accepts a phone with exactly 10 digits (landline)', () => {
    const result = clientFormSchema.safeParse({
      ...validValues,
      phone: '1133334444',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a phone formatted with punctuation as long as digit count is enough', () => {
    const result = clientFormSchema.safeParse({
      ...validValues,
      phone: '(11) 3333-4444',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = clientFormSchema.safeParse({
      ...validValues,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('accepts an empty email as optional', () => {
    const result = clientFormSchema.safeParse({ ...validValues, email: '' })
    expect(result.success).toBe(true)
  })

  it('accepts a missing birthDate/notes', () => {
    const result = clientFormSchema.safeParse({
      name: 'Maria Silva',
      phone: '(11) 98765-4321',
    })
    expect(result.success).toBe(true)
  })
})
