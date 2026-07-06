import { Moon, Sparkles, Sun } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="flex items-center gap-2">
        <Sparkles className="text-brand-500 size-5" aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Agenda Estética
        </span>
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
