import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="status"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="bg-warning-500/10 overflow-hidden"
        >
          <div className="text-warning-600 dark:text-warning-400 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
            <WifiOff className="size-4 flex-none" aria-hidden="true" />
            Você está offline. Seus dados continuam salvos neste dispositivo.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
