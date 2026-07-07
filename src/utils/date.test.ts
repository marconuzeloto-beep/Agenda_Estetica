import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMinutes,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  formatDayMonth,
  formatFullDate,
  formatMonthShort,
  formatMonthYear,
  formatTime,
  formatWeekdayShort,
  formatWeekRangeLabel,
  getMonthGridDays,
  getWeekDays,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDateInputValue,
  toTimeInputValue,
} from './date'

describe('startOfDay', () => {
  it('zeroes out the time components', () => {
    const result = startOfDay(new Date(2026, 5, 15, 13, 45, 30, 500))
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
    expect(result.getDate()).toBe(15)
  })

  it('does not mutate the input date', () => {
    const input = new Date(2026, 5, 15, 13, 0)
    startOfDay(input)
    expect(input.getHours()).toBe(13)
  })
})

describe('endOfDay', () => {
  it('sets the time to the last millisecond of the day', () => {
    const result = endOfDay(new Date(2026, 5, 15, 3, 0))
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    const result = addDays(new Date(2026, 0, 30), 3)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(2)
  })

  it('subtracts days with a negative amount', () => {
    const result = addDays(new Date(2026, 1, 2), -3)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(30)
  })

  it('supports a zero amount as a no-op', () => {
    const input = new Date(2026, 5, 15)
    const result = addDays(input, 0)
    expect(result.getTime()).toBe(input.getTime())
  })
})

describe('addMinutes', () => {
  it('rolls over into the next hour', () => {
    const result = addMinutes(new Date(2026, 5, 15, 9, 45), 30)
    expect(result.getHours()).toBe(10)
    expect(result.getMinutes()).toBe(15)
  })
})

describe('addMonths', () => {
  it('adds whole months without day overflow', () => {
    const result = addMonths(new Date(2026, 6, 15), 1)
    expect(result.getMonth()).toBe(7)
    expect(result.getDate()).toBe(15)
  })

  it('clamps to the last day of a shorter target month (Mar 31 - 1 month -> Feb 28)', () => {
    const result = addMonths(new Date(2026, 2, 31), -1)
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(28)
  })

  it('rolls back across a year boundary (Jan 31 - 1 month -> Dec 31, no clamping needed)', () => {
    const result = addMonths(new Date(2026, 0, 31), -1)
    expect(result.getFullYear()).toBe(2025)
    expect(result.getMonth()).toBe(11)
    expect(result.getDate()).toBe(31)
  })

  it('clamps forward across a month boundary (Mar 31 + 1 month -> Apr 30)', () => {
    const result = addMonths(new Date(2026, 2, 31), 1)
    expect(result.getMonth()).toBe(3)
    expect(result.getDate()).toBe(30)
  })

  it('lands on Feb 29 in a leap year when clamping', () => {
    const result = addMonths(new Date(2028, 0, 31), 1)
    expect(result.getFullYear()).toBe(2028)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(29)
  })

  it('lands on Feb 28 in a non-leap year when clamping', () => {
    const result = addMonths(new Date(2026, 11, 31), 2)
    expect(result.getFullYear()).toBe(2027)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(28)
  })

  it('crosses a year boundary correctly', () => {
    const result = addMonths(new Date(2026, 11, 15), 1)
    expect(result.getFullYear()).toBe(2027)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(15)
  })
})

describe('startOfWeek / endOfWeek', () => {
  it('starts the week on Monday even when given a Sunday', () => {
    // 2026-07-05 is a Sunday
    const result = startOfWeek(new Date(2026, 6, 5))
    expect(result.getDay()).toBe(1)
    expect(result.getDate()).toBe(29)
    expect(result.getMonth()).toBe(5)
  })

  it('returns the same date when already a Monday', () => {
    // 2026-07-06 is a Monday
    const result = startOfWeek(new Date(2026, 6, 6, 15, 30))
    expect(result.getDay()).toBe(1)
    expect(result.getDate()).toBe(6)
    expect(result.getHours()).toBe(0)
  })

  it('ends the week on Sunday at 23:59:59.999', () => {
    const result = endOfWeek(new Date(2026, 6, 6))
    expect(result.getDay()).toBe(0)
    expect(result.getDate()).toBe(12)
    expect(result.getHours()).toBe(23)
  })
})

describe('startOfMonth / endOfMonth', () => {
  it('returns the first day of the month at midnight', () => {
    const result = startOfMonth(new Date(2026, 6, 15))
    expect(result.getDate()).toBe(1)
    expect(result.getHours()).toBe(0)
  })

  it('returns the last day of the month at end of day', () => {
    const result = endOfMonth(new Date(2026, 1, 10))
    expect(result.getDate()).toBe(28)
    expect(result.getMonth()).toBe(1)
  })

  it('handles the last day of a 31-day month', () => {
    const result = endOfMonth(new Date(2026, 6, 1))
    expect(result.getDate()).toBe(31)
  })
})

describe('isSameDay', () => {
  it('returns true for the same calendar day at different times', () => {
    expect(
      isSameDay(new Date(2026, 5, 15, 1, 0), new Date(2026, 5, 15, 23, 59)),
    ).toBe(true)
  })

  it('returns false for different days', () => {
    expect(isSameDay(new Date(2026, 5, 15), new Date(2026, 5, 16))).toBe(
      false,
    )
  })

  it('returns false for the same day/month but different years', () => {
    expect(isSameDay(new Date(2025, 5, 15), new Date(2026, 5, 15))).toBe(
      false,
    )
  })
})

describe('toDateInputValue', () => {
  it('formats as YYYY-MM-DD with zero-padding', () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('toTimeInputValue', () => {
  it('formats as HH:MM with zero-padding', () => {
    expect(toTimeInputValue(new Date(2026, 0, 5, 9, 5))).toBe('09:05')
  })

  it('formats midnight correctly', () => {
    expect(toTimeInputValue(new Date(2026, 0, 5, 0, 0))).toBe('00:00')
  })
})

describe('getMonthGridDays', () => {
  it('returns 42 days starting on a Monday', () => {
    const days = getMonthGridDays(new Date(2026, 6, 15))
    expect(days).toHaveLength(42)
    expect(days[0].getDay()).toBe(1)
  })

  it('includes the first day of the given month', () => {
    const days = getMonthGridDays(new Date(2026, 6, 15))
    const hasFirstOfMonth = days.some(
      (day) => day.getMonth() === 6 && day.getDate() === 1,
    )
    expect(hasFirstOfMonth).toBe(true)
  })
})

describe('getWeekDays', () => {
  it('returns 7 consecutive days starting on Monday', () => {
    const days = getWeekDays(new Date(2026, 6, 8))
    expect(days).toHaveLength(7)
    expect(days[0].getDay()).toBe(1)
    expect(days[6].getDay()).toBe(0)
  })
})

describe('formatters', () => {
  it('formatTime renders HH:MM in pt-BR', () => {
    expect(formatTime(new Date(2026, 0, 1, 8, 5))).toMatch(/08:05/)
  })

  it('formatWeekdayShort capitalizes and strips the trailing dot', () => {
    const result = formatWeekdayShort(new Date(2026, 6, 6)) // Monday
    expect(result[0]).toBe(result[0].toUpperCase())
    expect(result).not.toContain('.')
  })

  it('formatDayMonth renders day and abbreviated month', () => {
    expect(formatDayMonth(new Date(2026, 6, 6))).toMatch(/6/)
  })

  it('formatMonthYear capitalizes the month name', () => {
    const result = formatMonthYear(new Date(2026, 6, 6))
    expect(result[0]).toBe(result[0].toUpperCase())
    expect(result).toContain('2026')
  })

  it('formatMonthShort capitalizes and strips the trailing dot', () => {
    const result = formatMonthShort(new Date(2026, 6, 6))
    expect(result[0]).toBe(result[0].toUpperCase())
    expect(result).not.toContain('.')
  })

  it('formatFullDate capitalizes the weekday', () => {
    const result = formatFullDate(new Date(2026, 6, 6))
    expect(result[0]).toBe(result[0].toUpperCase())
  })

  it('formatWeekRangeLabel joins start day with end day/month', () => {
    const start = new Date(2026, 6, 6)
    const end = new Date(2026, 6, 12)
    expect(formatWeekRangeLabel(start, end)).toBe('6 – 12 de jul.')
  })
})
