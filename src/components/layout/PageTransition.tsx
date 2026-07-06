import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
      className={cn('mx-auto flex max-w-2xl flex-col gap-4', className)}
    >
      {children}
    </motion.div>
  )
}
