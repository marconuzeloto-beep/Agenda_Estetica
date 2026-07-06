import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { IconButton } from './IconButton'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// `:not(x)` in a selector list only binds to the last item (e.g. "a, b:not(x)"
// excludes x from b only), so exclusion must be appended to every comma-separated part.
const INITIAL_FOCUS_SELECTOR = FOCUSABLE_SELECTOR.split(',')
  .map((part) => `${part.trim()}:not([data-dialog-close])`)
  .join(', ')

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Focus trap + initial focus + focus restore. Depends only on `open` so that
  // parent re-renders (which recreate `onClose`) don't steal focus mid-typing.
  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement as HTMLElement | null

    const panel = panelRef.current
    // Prefer the first form field over the close button for a better initial focus.
    const firstField =
      panel?.querySelector<HTMLElement>(INITIAL_FOCUS_SELECTOR) ??
      panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    firstField?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !panel) return

      const elements = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="absolute inset-0 bg-neutral-900/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: 'easeOut',
            }}
            className={cn(
              'shadow-elevated relative z-10 max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-xl bg-white p-5 sm:rounded-xl dark:bg-neutral-800',
              className,
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {title}
              </h2>
              <IconButton
                aria-label="Fechar"
                onClick={onClose}
                data-dialog-close
              >
                <X className="size-5" aria-hidden="true" />
              </IconButton>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
