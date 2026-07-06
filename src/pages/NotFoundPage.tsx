import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <CompassIcon className="text-brand-400 size-10" aria-hidden="true" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Página não encontrada
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          O conteúdo que você procura não existe ou foi movido.
        </p>
      </div>
      <Link
        to="/"
        className="bg-brand-500 hover:bg-brand-600 focus-visible:ring-brand-400 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
