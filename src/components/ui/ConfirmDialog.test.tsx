import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Excluir cliente"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the title and description when open', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir cliente"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('dialog', { name: 'Excluir cliente' })).toBeInTheDocument()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('uses default confirm/cancel labels', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: /^Excluir$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('supports custom confirm/cancel labels', () => {
    render(
      <ConfirmDialog
        open
        title="Remover"
        description="Tem certeza?"
        confirmLabel="Remover item"
        cancelLabel="Manter"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Remover item' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Manter' })).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    )
    await user.click(screen.getByRole('button', { name: /^Excluir$/ }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    )
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('shows an error message when provided', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
        error="Não foi possível excluir."
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível excluir.',
    )
  })

  it('does not show an error message by default', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('disables interaction and shows a loading state on the confirm button', () => {
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
        isLoading
      />,
    )
    expect(screen.getByRole('button', { name: /^Excluir$/ })).toBeDisabled()
  })
})
