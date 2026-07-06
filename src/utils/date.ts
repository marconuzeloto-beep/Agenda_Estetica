const WEEK_STARTS_ON = 1 // segunda-feira

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export function addMinutes(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + amount)
  return result
}

export function addMonths(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + amount)
  return result
}

export function startOfWeek(date: Date): Date {
  const result = startOfDay(date)
  const day = result.getDay()
  const diff = (day < WEEK_STARTS_ON ? 7 : 0) + day - WEEK_STARTS_ON
  return addDays(result, -diff)
}

export function endOfWeek(date: Date): Date {
  return endOfDay(addDays(startOfWeek(date), 6))
}

export function startOfMonth(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

export function endOfMonth(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Retorna as 42 datas (6 semanas) da grade mensal, começando na segunda-feira. */
export function getMonthGridDays(date: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(date))
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})
const weekdayShortFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
})
const dayMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})
const monthYearFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})
const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

export function formatWeekdayShort(date: Date): string {
  return capitalize(weekdayShortFormatter.format(date).replace('.', ''))
}

export function formatDayMonth(date: Date): string {
  return dayMonthFormatter.format(date)
}

export function formatMonthYear(date: Date): string {
  return capitalize(monthYearFormatter.format(date))
}

export function formatFullDate(date: Date): string {
  return capitalize(fullDateFormatter.format(date))
}

export function formatWeekRangeLabel(start: Date, end: Date): string {
  return `${start.getDate()} – ${formatDayMonth(end)}`
}
