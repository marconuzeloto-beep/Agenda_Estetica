import { Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export function InstallPwaButton() {
  const { canInstall, promptInstall } = useInstallPrompt()

  if (!canInstall) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={promptInstall}
      aria-label="Instalar aplicativo"
    >
      <Download className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Instalar app</span>
    </Button>
  )
}
