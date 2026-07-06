import { useMemo } from 'react'
import { useAppointmentsRange } from '@/features/agenda/hooks/useAppointmentsRange'
import { useProcedures } from '@/features/procedures/hooks/useProcedures'
import { addMonths, endOfDay, startOfMonth } from '@/utils/date'
import { buildPriceMap } from '../utils'

export function useFinanceData(referenceDate: Date) {
  const rangeStart = useMemo(
    () => startOfMonth(addMonths(referenceDate, -5)),
    [referenceDate],
  )
  const rangeEnd = useMemo(() => endOfDay(referenceDate), [referenceDate])

  const { data: appointments = [], isLoading: appointmentsLoading } =
    useAppointmentsRange(rangeStart, rangeEnd)
  const { data: procedures = [], isLoading: proceduresLoading } =
    useProcedures()

  const priceByProcedureId = useMemo(
    () => buildPriceMap(procedures),
    [procedures],
  )

  return {
    appointments,
    priceByProcedureId,
    isLoading: appointmentsLoading || proceduresLoading,
  }
}
