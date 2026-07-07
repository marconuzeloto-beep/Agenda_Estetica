import { useEffect } from 'react'
import type { UseFormReset } from 'react-hook-form'

export function useResetFormOnOpen<T extends Record<string, unknown>>(
  open: boolean,
  reset: UseFormReset<T>,
  values: T,
) {
  useEffect(() => {
    if (open) reset(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}
