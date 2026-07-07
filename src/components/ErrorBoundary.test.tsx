import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function Bomb(): never {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // React logs the caught error to console.error (both its own internal log
    // and our componentDidCatch); silence it so the test output stays clean.
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Conteúdo normal</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument()
  })

  it('renders the fallback UI when a descendant throws during render', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Recarregar' }),
    ).toBeInTheDocument()
  })

  it('logs the caught error via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    const loggedOurMessage = consoleErrorSpy.mock.calls.some(
      (call: unknown[]) =>
        call.some(
          (arg) =>
            typeof arg === 'string' &&
            arg.includes('Erro não tratado na aplicação'),
        ),
    )
    expect(loggedOurMessage).toBe(true)
  })

  it('reloads the page when the fallback button is clicked', async () => {
    const reloadSpy = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadSpy },
    })

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    screen.getByRole('button', { name: 'Recarregar' }).click()

    expect(reloadSpy).toHaveBeenCalledTimes(1)

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })
})
