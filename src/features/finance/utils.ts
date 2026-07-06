import type { Appointment } from '@/features/agenda/types'
import type { Procedure } from '@/features/procedures/types'
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
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

export function getDailyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  days = 7,
): { date: Date; total: number }[] {
  const today = startOfDay(referenceDate)
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(today, index - (days - 1))
    const dayAppointments = appointments.filter((appointment) =>
      isSameDay(appointment.start, date),
    )
    return { date, total: sumRevenue(dayAppointments, priceByProcedureId) }
  })
}

export function getWeeklyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  weeks = 6,
): { weekStart: Date; total: number }[] {
  const currentWeekStart = startOfWeek(referenceDate)
  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = addDays(currentWeekStart, (index - (weeks - 1)) * 7)
    const weekEnd = endOfDay(addDays(weekStart, 6))
    const weekAppointments = appointments.filter(
      (appointment) =>
        appointment.start >= weekStart && appointment.start <= weekEnd,
    )
    return {
      weekStart,
      total: sumRevenue(weekAppointments, priceByProcedureId),
    }
  })
}

export function getMonthlyRevenueSeries(
  appointments: Appointment[],
  priceByProcedureId: Map<string, number>,
  referenceDate: Date,
  months = 6,
): { monthStart: Date; total: number }[] {
  return Array.from({ length: months }, (_, index) => {
    const monthStart = startOfMonth(
      addMonths(referenceDate, index - (months - 1)),
    )
    const monthEnd = endOfMonth(monthStart)
    const monthAppointments = appointments.filter(
      (appointment) =>
        appointment.start >= monthStart && appointment.start <= monthEnd,
    )
    return {
      monthStart,
      total: sumRevenue(monthAppointments, priceByProcedureId),
    }
  })
}
