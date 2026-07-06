import { CalendarDays, Home } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'
import { Header } from '@/components/layout/Header'
import type { NavItem } from '@/components/layout/types'

const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
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
