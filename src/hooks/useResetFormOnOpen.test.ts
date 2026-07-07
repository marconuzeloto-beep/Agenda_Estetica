import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useResetFormOnOpen } from './useResetFormOnOpen'

describe('useResetFormOnOpen', () => {
  it('resets the form immediately when mounted open', () => {
    const reset = vi.fn()
    renderHook(() => useResetFormOnOpen(true, reset, { name: 'Ana' }))
    expect(reset).toHaveBeenCalledWith({ name: 'Ana' })
  })

  it('does not reset when mounted closed', () => {
    const reset = vi.fn()
    renderHook(() => useResetFormOnOpen(false, reset, { name: 'Ana' }))
    expect(reset).not.toHaveBeenCalled()
  })

  it('resets again when transitioning from closed to open', () => {
    const reset = vi.fn()
    let open = false
    let values = { name: 'Ana' }
    const { rerender } = renderHook(() =>
      useResetFormOnOpen(open, reset, values),
    )
    expect(reset).not.toHaveBeenCalled()

    open = true
    values = { name: 'Beatriz' }
    rerender()

    expect(reset).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledWith({ name: 'Beatriz' })
  })

  it('does not reset again while staying open even if values change', () => {
    const reset = vi.fn()
    let values = { name: 'Ana' }
    const { rerender } = renderHook(() =>
      useResetFormOnOpen(true, reset, values),
    )
    expect(reset).toHaveBeenCalledTimes(1)

    values = { name: 'Beatriz' }
    rerender()

    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('does not reset when transitioning from open to closed', () => {
    const reset = vi.fn()
    let open = true
    const { rerender } = renderHook(() =>
      useResetFormOnOpen(open, reset, { name: 'Ana' }),
    )
    expect(reset).toHaveBeenCalledTimes(1)

    open = false
    rerender()

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
