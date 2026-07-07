import { describe, expect, it } from 'vitest'
import { formatDuration } from './utils'

describe('formatDuration', () => {
  it('formats durations under an hour in minutes', () => {
    expect(formatDuration(30)).toBe('30 min')
  })

  it('formats exactly one hour without minutes', () => {
    expect(formatDuration(60)).toBe('1h')
  })

  it('formats an hour and a half with zero-padded minutes', () => {
    expect(formatDuration(90)).toBe('1h30')
  })

  it('formats multiple hours with single-digit remainder padded', () => {
    expect(formatDuration(125)).toBe('2h05')
  })

  it('formats a duration of zero minutes', () => {
    expect(formatDuration(0)).toBe('0 min')
  })

  it('formats a long duration spanning several hours', () => {
    expect(formatDuration(480)).toBe('8h')
  })
})
