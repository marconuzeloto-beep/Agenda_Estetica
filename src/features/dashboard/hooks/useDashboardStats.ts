import { useMemo } from 'react'
import { useAppointmentsRange } from '@/features/agenda/hooks/useAppointmentsRange'
import { endOfDay, endOfWeek, startOfDay } from '@/utils/date'

export function useDashboardStats() {
  const now = new Date()
  const rangeStart = startOfDay(now)
  const rangeEnd = endOfWeek(now)

  const { data: appointments = [], isLoading } = useAppointmentsRange(
    rangeStart,
    rangeEnd,
  )

  const stats = useMemo(() => {
    const todayEnd = endOfDay(now)
    const todayCount = appointments.filter(
      (appointment) =>
        appointment.start >= rangeStart && appointment.start <= todayEnd,
    ).length

    const upcoming = appointments
      .filter((appointment) => appointment.end >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5)

    return {
      todayCount,
      weekCount: appointments.length,
      nextAppointment: upcoming[0],
      upcoming,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments])

  return { ...stats, isLoading }
}
