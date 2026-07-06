import { Moon, Sparkles, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { IconButton } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'
import type { NavItem } from './types'

export interface HeaderProps {
  navItems: NavItem[]
}

export function Header({ navItems }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand-500 size-5" aria-hidden="true" />
          <span className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Agenda Estética
          </span>
        </div>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 sm:flex"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100',
                  isActive &&
                    'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
                )
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <IconButton
        aria-label={
          theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
        }
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className="size-5" aria-hidden="true" />
        ) : (
          <Moon className="size-5" aria-hidden="true" />
        )}
      </IconButton>
    </header>
  )
}
