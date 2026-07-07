import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins plain class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b')
  })

  it('applies conditional classes via object syntax', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })

  it('resolves conflicting Tailwind utility classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('merges non-conflicting classes with conflict resolution combined', () => {
    expect(cn('text-sm font-medium', 'text-lg')).toBe('font-medium text-lg')
  })

  it('returns an empty string for no input', () => {
    expect(cn()).toBe('')
  })
})
