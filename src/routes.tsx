/* eslint-disable react-refresh/only-export-components -- route config, not a component module */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { RootLayout } from '@/layouts/RootLayout'

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AgendaPage = lazy(() =>
  import('@/pages/AgendaPage').then((m) => ({ default: m.AgendaPage })),
)
const ClientsPage = lazy(() =>
  import('@/pages/ClientsPage').then((m) => ({ default: m.ClientsPage })),
)
const ClientDetailPage = lazy(() =>
  import('@/pages/ClientDetailPage').then((m) => ({
    default: m.ClientDetailPage,
  })),
)
const ProceduresPage = lazy(() =>
  import('@/pages/ProceduresPage').then((m) => ({
    default: m.ProceduresPage,
  })),
)
const FinancePage = lazy(() =>
  import('@/pages/FinancePage').then((m) => ({ default: m.FinancePage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'agenda', element: <AgendaPage /> },
          { path: 'clientes', element: <ClientsPage /> },
          { path: 'clientes/:id', element: <ClientDetailPage /> },
          { path: 'procedimentos', element: <ProceduresPage /> },
          { path: 'financeiro', element: <FinancePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
