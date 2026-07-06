import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui'

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mx-auto flex max-w-2xl flex-col gap-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Bem-vinda</CardTitle>
          <CalendarDays className="text-brand-500 size-5" aria-hidden="true" />
        </CardHeader>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Base do app criada. As funcionalidades da agenda serão adicionadas nas
          próximas sprints.
        </p>
      </Card>
    </motion.div>
  )
}
