import { TriangleAlert } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro não tratado na aplicação:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center dark:bg-neutral-900">
          <TriangleAlert
            className="text-danger-600 dark:text-danger-400 size-10"
            aria-hidden="true"
          />
          <h1 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Algo deu errado
          </h1>
          <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
            Ocorreu um erro inesperado. Tente recarregar a página para
            continuar.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      )
    }

    return this.props.children
  }
}
