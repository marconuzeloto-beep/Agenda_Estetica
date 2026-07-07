import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Dialog } from './Dialog'

function TriggerAndDialog() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Editar cliente">
        <input placeholder="Nome" />
        <input placeholder="Telefone" />
      </Dialog>
    </div>
  )
}

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Título">
        <p>Conteúdo</p>
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with an accessible name matching the title', () => {
    render(
      <Dialog open onClose={() => {}} title="Editar cliente">
        <p>Conteúdo</p>
      </Dialog>,
    )
    expect(
      screen.getByRole('dialog', { name: 'Editar cliente' }),
    ).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Dialog>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking the backdrop', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Dialog>,
    )
    // Dialog renders via a portal into document.body, so it isn't inside
    // the render() container.
    const backdrop = document.body.querySelector('[aria-hidden="true"]')
    expect(backdrop).not.toBeNull()
    await user.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves initial focus to the first focusable field rather than the close button', () => {
    render(
      <Dialog open onClose={() => {}} title="Editar cliente">
        <input placeholder="Nome" />
      </Dialog>,
    )
    expect(screen.getByPlaceholderText('Nome')).toHaveFocus()
  })

  it('traps Tab focus within the dialog, wrapping from the last to the first element', async () => {
    const user = userEvent.setup()
    render(
      <Dialog open onClose={() => {}} title="Editar cliente">
        <input placeholder="Nome" />
        <input placeholder="Telefone" />
      </Dialog>,
    )

    const closeButton = screen.getByRole('button', { name: 'Fechar' })
    closeButton.focus()
    await user.tab()

    expect(screen.getByPlaceholderText('Nome')).toHaveFocus()
  })

  it('restores focus to the previously focused element after closing', async () => {
    const user = userEvent.setup()
    render(<TriggerAndDialog />)

    const trigger = screen.getByRole('button', { name: 'Abrir' })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })
})
