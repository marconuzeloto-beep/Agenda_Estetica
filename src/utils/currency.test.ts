import { describe, expect, it } from 'vitest'
import { formatCurrency } from './currency'

function normalize(value: string): string {
  return value.replace(/\u00A0/g, ' ')
}

describe('formatCurrency', () => {
  it('formats a positive value as BRL', () => {
    expect(normalize(formatCurrency(150))).toBe('R$ 150,00')
  })

  it('formats zero', () => {
    expect(normalize(formatCurrency(0))).toBe('R$ 0,00')
  })

  it('formats a negative value', () => {
    expect(normalize(formatCurrency(-50))).toBe('-R$ 50,00')
  })

  it('formats a large value with thousands separators', () => {
    expect(normalize(formatCurrency(1234567.89))).toBe('R$ 1.234.567,89')
  })

  it('rounds to two decimal places', () => {
    expect(normalize(formatCurrency(19.999))).toBe('R$ 20,00')
  })

  it('formats a fractional value below one unit', () => {
    expect(normalize(formatCurrency(0.5))).toBe('R$ 0,50')
  })
})
