import type { Appointment } from '@/features/agenda/types'
import type { Procedure } from '@/features/procedures/types'
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '@/utils/date'
import type { FinanceSummary } from './types'

export function buildPriceMap(procedures: Procedure[]): Map<string, number> {
  return new Map(procedures.map((procedure) => [procedure.id, procedure.price]))
}

function getAppointmentValue(
  appointment: Appointment,
  priceByProcedureId: Map<string, number>,
): number {
  if (!appointment.procedureId) return 0
  return priceByProcedureId.get(appointment.procedureId) ?? 0
}

export function sumRevenue(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
): number {
  return appointments.reduce(
    (total, appointment) =>
      total + getAppointmentValue(appointment, priceByProcedureId),
    0,
  )
}

export function getFinanceSummary(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
): FinanceSummary {
  const todayStart = startOfDay(referenceDate)
  const todayEnd = endOfDay(referenceDate)
  const weekStart = startOfWeek(referenceDate)
  const weekEnd = endOfWeek(referenceDate)
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)

  const inRange = (start: Date, end: Date) =>
    appointments.filter(
      (appointment) => appointment.start >= start && appointment.start <= end,
    )

  const todayAppointments = inRange(todayStart, todayEnd)
  const weekAppointments = inRange(weekStart, weekEnd)
  const monthAppointments = inRange(monthStart, monthEnd)

  const monthTotal = sumRevenue(monthAppointments, priceByProcedureId)
  const monthAppointmentsWithValue = monthAppointments.filter(
    (appointment) =>
      appointment.procedureId &&
      priceByProcedureId.has(appointment.procedureId),
  )

  return {
    todayTotal: sumRevenue(todayAppointments, priceByProcedureId),
    weekTotal: sumRevenue(weekAppointments, priceByProcedureId),
    monthTotal,
    averageTicket:
      monthAppointmentsWithValue.length > 0
        ? monthTotal / monthAppointmentsWithValue.length
        : 0,
  }
}

function buildRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  count: number,
  getBucket: (offset: number) => { bucketStart: Date; start: Date; end: Date },
): { bucketStart: Date; total: number }[] {
  return Array.from({ length: count }, (_, index) => {
    const { bucketStart, start, end } = getBucket(index - (count - 1))
    const bucketAppointments = appointments.filter(
      (appointment) => appointment.start >= start && appointment.start <= end,
    )
    return {
      bucketStart,
      total: sumRevenue(bucketAppointments, priceByProcedureId),
    }
  })
}

export function getDailyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  days = 7,
): { date: Date; total: number }[] {
  const today = startOfDay(referenceDate)
  return buildRevenueSeries(appointments, priceByProcedureId, days, (offset) => {
    const date = addDays(today, offset)
    return { bucketStart: date, start: date, end: endOfDay(date) }
  }).map(({ bucketStart, total }) => ({ date: bucketStart, total }))
}

export function getWeeklyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  weeks = 6,
): { weekStart: Date; total: number }[] {
  const currentWeekStart = startOfWeek(referenceDate)
  return buildRevenueSeries(
    appointments,
    priceByProcedureId,
    weeks,
    (offset) => {
      const weekStart = addDays(currentWeekStart, offset * 7)
      return {
        bucketStart: weekStart,
        start: weekStart,
        end: endOfDay(addDays(weekStart, 6)),
      }
    },
  ).map(({ bucketStart, total }) => ({ weekStart: bucketStart, total }))
}

export function getMonthlyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  months = 6,
): { monthStart: Date; total: number }[] {
  return buildRevenueSeries(
    appointments,
    priceByProcedureId,
    months,
    (offset) => {
      const monthStart = startOfMonth(addMonths(referenceDate, offset))
      return {
        bucketStart: monthStart,
        start: monthStart,
        end: endOfMonth(monthStart),
      }
    },
  ).map(({ bucketStart, total }) => ({ monthStart: bucketStart, total }))
}
