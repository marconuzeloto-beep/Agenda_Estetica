import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { NavItem } from './types'

export type { NavItem }

export interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-20 border-t border-neutral-200 bg-white/90 backdrop-blur-sm sm:hidden dark:border-neutral-800 dark:bg-neutral-900/90"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2 text-xs font-medium text-neutral-500 transition-colors dark:text-neutral-400',
                  isActive && 'text-brand-500 dark:text-brand-400',
                )
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
