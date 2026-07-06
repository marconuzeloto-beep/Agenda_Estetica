import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Usa correspondência exata de rota (padrão: false, casa também sub-rotas). */
  end?: boolean
}
