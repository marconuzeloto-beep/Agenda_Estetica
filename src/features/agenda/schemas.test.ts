import { describe, expect, it } from 'vitest'
import { appointmentFormSchema } from './schemas'

const validValues = {
  title: 'Limpeza de pele',
  clientId: '',
  procedureId: '',
  date: '2026-07-10',
  startTime: '09:00',
  endTime: '10:00',
  notes: '',
}

describe('appointmentFormSchema', () => {
  it('accepts valid values', () => {
    const result = appointmentFormSchema.safeParse(validValues)
    expect(result.success).toBe(true)
  })

  it('trims the title', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      title: '  Limpeza de pele  ',
    })
    expect(result.success).toBe(true)
    expect(result.success && result.data.title).toBe('Limpeza de pele')
  })

  it('rejects an empty title', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      title: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a title made only of whitespace', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      title: '   ',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a missing date', () => {
    const result = appointmentFormSchema.safeParse({ ...validValues, date: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing start time', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      startTime: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects when end time is before start time', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      startTime: '10:00',
      endTime: '09:00',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['endTime'])
    }
  })

  it('rejects when end time equals start time', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      startTime: '09:00',
      endTime: '09:00',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional clientId/procedureId/notes as empty strings', () => {
    const result = appointmentFormSchema.safeParse(validValues)
    expect(result.success).toBe(true)
  })

  it('accepts optional clientId/procedureId when populated', () => {
    const result = appointmentFormSchema.safeParse({
      ...validValues,
      clientId: 'client-1',
      procedureId: 'procedure-1',
      notes: 'Pele sensível',
    })
    expect(result.success).toBe(true)
  })
})
