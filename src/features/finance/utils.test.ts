import { describe, expect, it } from 'vitest'
import type { Appointment } from '@/features/agenda/types'
import type { Procedure } from '@/features/procedures/types'
import {
  buildPriceMap,
  getDailyRevenueSeries,
  getFinanceSummary,
  getMonthlyRevenueSeries,
  getWeeklyRevenueSeries,
  sumRevenue,
} from './utils'

function makeProcedure(overrides: Partial<Procedure>): Procedure {
  return {
    id: 'default-procedure',
    name: 'Procedimento',
    category: 'Rosto',
    durationMinutes: 60,
    price: 100,
    createdAt: new Date(2026, 0, 1),
    ...overrides,
  }
}

function makeAppointment(overrides: Partial<Appointment>): Appointment {
  return {
    id: 'default-appointment',
    title: 'Serviço',
    start: new Date(2026, 6, 8, 9, 0),
    end: new Date(2026, 6, 8, 10, 0),
    ...overrides,
  }
}

describe('buildPriceMap', () => {
  it('maps procedure ids to their prices', () => {
    const procedures = [
      makeProcedure({ id: 'p1', price: 150 }),
      makeProcedure({ id: 'p2', price: 90 }),
    ]
    const map = buildPriceMap(procedures)
    expect(map.get('p1')).toBe(150)
    expect(map.get('p2')).toBe(90)
  })

  it('returns an empty map for no procedures', () => {
    expect(buildPriceMap([]).size).toBe(0)
  })
})

describe('sumRevenue', () => {
  const priceMap = new Map([
    ['p1', 150],
    ['p2', 90],
  ])

  it('sums the price of linked procedures', () => {
    const appointments = [
      makeAppointment({ id: '1', procedureId: 'p1' }),
      makeAppointment({ id: '2', procedureId: 'p2' }),
    ]
    expect(sumRevenue(appointments, priceMap)).toBe(240)
  })

  it('treats appointments without a linked procedure as zero value', () => {
    const appointments = [makeAppointment({ id: '1', procedureId: undefined })]
    expect(sumRevenue(appointments, priceMap)).toBe(0)
  })

  it('treats a procedureId missing from the price map as zero value', () => {
    const appointments = [makeAppointment({ id: '1', procedureId: 'unknown' })]
    expect(sumRevenue(appointments, priceMap)).toBe(0)
  })

  it('returns zero for an empty appointment list', () => {
    expect(sumRevenue([], priceMap)).toBe(0)
  })
})

describe('getFinanceSummary', () => {
  // Wednesday, 2026-07-08. Week: Mon 07-06 .. Sun 07-12. Month: July 2026.
  const referenceDate = new Date(2026, 6, 8, 12, 0)
  const priceMap = new Map([['p1', 100]])

  it('buckets appointments into today/week/month and computes average ticket', () => {
    const appointments = [
      makeAppointment({
        id: 'today',
        procedureId: 'p1',
        start: new Date(2026, 6, 8, 9, 0),
      }),
      makeAppointment({
        id: 'earlier-this-week',
        procedureId: 'p1',
        start: new Date(2026, 6, 6, 9, 0),
      }),
      makeAppointment({
        id: 'earlier-this-month',
        procedureId: 'p1',
        start: new Date(2026, 6, 1, 9, 0),
      }),
      makeAppointment({
        id: 'last-month',
        procedureId: 'p1',
        start: new Date(2026, 5, 30, 9, 0),
      }),
    ]

    const summary = getFinanceSummary(appointments, priceMap, referenceDate)

    expect(summary.todayTotal).toBe(100)
    expect(summary.weekTotal).toBe(200)
    expect(summary.monthTotal).toBe(300)
    expect(summary.averageTicket).toBe(100)
  })

  it('returns zeroes when there are no appointments', () => {
    const summary = getFinanceSummary([], priceMap, referenceDate)
    expect(summary).toEqual({
      todayTotal: 0,
      weekTotal: 0,
      monthTotal: 0,
      averageTicket: 0,
    })
  })

  it('does not count appointments without a priced procedure in the average ticket', () => {
    const appointments = [
      makeAppointment({
        id: 'no-procedure',
        start: new Date(2026, 6, 8, 9, 0),
      }),
    ]
    const summary = getFinanceSummary(appointments, priceMap, referenceDate)
    expect(summary.monthTotal).toBe(0)
    expect(summary.averageTicket).toBe(0)
  })

  it('excludes appointments outside the month range', () => {
    const appointments = [
      makeAppointment({
        id: 'next-month',
        procedureId: 'p1',
        start: new Date(2026, 7, 1, 9, 0),
      }),
    ]
    const summary = getFinanceSummary(appointments, priceMap, referenceDate)
    expect(summary.monthTotal).toBe(0)
  })
})

describe('getDailyRevenueSeries', () => {
  const priceMap = new Map([['p1', 50]])

  it('returns one bucket per day ending on the reference date', () => {
    const referenceDate = new Date(2026, 6, 8)
    const series = getDailyRevenueSeries([], priceMap, referenceDate, 7)
    expect(series).toHaveLength(7)
    expect(series[6].date.getDate()).toBe(8)
    expect(series[0].date.getDate()).toBe(2)
  })

  it('assigns an appointment to the matching day bucket only', () => {
    const referenceDate = new Date(2026, 6, 8)
    const appointments = [
      makeAppointment({
        id: '1',
        procedureId: 'p1',
        start: new Date(2026, 6, 6, 9, 0),
      }),
    ]
    const series = getDailyRevenueSeries(appointments, priceMap, referenceDate, 7)
    const totals = series.map((point) => point.total)
    expect(totals.filter((total) => total > 0)).toEqual([50])
  })

  it('supports a custom number of days', () => {
    const series = getDailyRevenueSeries([], priceMap, new Date(2026, 6, 8), 3)
    expect(series).toHaveLength(3)
  })
})

describe('getWeeklyRevenueSeries', () => {
  const priceMap = new Map([['p1', 200]])

  it('returns one bucket per week ending on the current week', () => {
    const referenceDate = new Date(2026, 6, 8) // Wednesday of the week of 07-06
    const series = getWeeklyRevenueSeries([], priceMap, referenceDate, 6)
    expect(series).toHaveLength(6)
    expect(series[5].weekStart.getDate()).toBe(6)
    expect(series[5].weekStart.getMonth()).toBe(6)
  })

  it('sums appointments that fall anywhere within the week bucket', () => {
    const referenceDate = new Date(2026, 6, 8)
    const appointments = [
      makeAppointment({
        id: 'mon',
        procedureId: 'p1',
        start: new Date(2026, 6, 6, 8, 0),
      }),
      makeAppointment({
        id: 'sun',
        procedureId: 'p1',
        start: new Date(2026, 6, 12, 20, 0),
      }),
    ]
    const series = getWeeklyRevenueSeries(appointments, priceMap, referenceDate, 6)
    expect(series[5].total).toBe(400)
  })
})

describe('getMonthlyRevenueSeries', () => {
  const priceMap = new Map([['p1', 300]])

  it('returns one bucket per month ending on the reference month', () => {
    const referenceDate = new Date(2026, 6, 8)
    const series = getMonthlyRevenueSeries([], priceMap, referenceDate, 6)
    expect(series).toHaveLength(6)
    expect(series[5].monthStart.getMonth()).toBe(6)
    expect(series[0].monthStart.getMonth()).toBe(1) // February, 5 months back
  })

  it('sums appointments within the correct month bucket', () => {
    const referenceDate = new Date(2026, 6, 8)
    const appointments = [
      makeAppointment({
        id: 'this-month',
        procedureId: 'p1',
        start: new Date(2026, 6, 1, 8, 0),
      }),
      makeAppointment({
        id: 'two-months-ago',
        procedureId: 'p1',
        start: new Date(2026, 4, 15, 8, 0),
      }),
    ]
    const series = getMonthlyRevenueSeries(appointments, priceMap, referenceDate, 6)
    expect(series[5].total).toBe(300)
    expect(series[3].total).toBe(300)
  })

  it('does not overflow days when bucketing across shorter months (regression for addMonths fix)', () => {
    // Reference date on day 31 exercises the addMonths day-clamping fix
    // when walking backwards through months with fewer days.
    const referenceDate = new Date(2026, 2, 31) // March 31
    const series = getMonthlyRevenueSeries([], priceMap, referenceDate, 3)
    // 3 months back from March: Jan, Feb, Mar - Feb must clamp to 28, not roll into March.
    expect(series[0].monthStart.getMonth()).toBe(0)
    expect(series[1].monthStart.getMonth()).toBe(1)
    expect(series[1].monthStart.getDate()).toBe(1)
    expect(series[2].monthStart.getMonth()).toBe(2)
  })
})
