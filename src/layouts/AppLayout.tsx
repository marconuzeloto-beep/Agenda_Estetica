import { CalendarDays, Home, Scissors, Users, Wallet } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'
import { Header } from '@/components/layout/Header'
import type { NavItem } from '@/components/layout/types'

const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/procedimentos', label: 'Procedimentos', icon: Scissors },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
]

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header navItems={navItems} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <BottomNav items={navItems} />
    </div>
  )
}
