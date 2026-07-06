import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Spinner } from '@/components/ui'

function RootFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner label="Carregando aplicação" />
    </div>
  )
}

export function RootLayout() {
  return (
    <Suspense fallback={<RootFallback />}>
      <Outlet />
    </Suspense>
  )
}
