import { cn } from '@/utils/cn'
import { formatTime, formatWeekdayShort, isSameDay } from '@/utils/date'
import type { Appointment } from '../types'

const GRID_START_HOUR = 7
const GRID_END_HOUR = 20
const HOUR_HEIGHT = 56 // px
const LABEL_COLUMN_WIDTH = 48 // px

export interface TimeGridViewProps {
  days: Date[]
  appointments: Appointment[]
  onSlotClick: (date: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
}

function minutesFromGridStart(date: Date): number {
  return (date.getHours() - GRID_START_HOUR) * 60 + date.getMinutes()
}

export function TimeGridView({
  days,
  appointments,
  onSlotClick,
  onAppointmentClick,
}: TimeGridViewProps) {
  const hours = Array.from(
    { length: GRID_END_HOUR - GRID_START_HOUR },
    (_, i) => GRID_START_HOUR + i,
  )
  const totalHeight = hours.length * HOUR_HEIGHT
  const today = new Date()

  return (
    <div className="flex overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50">
      <div className="flex-none" style={{ width: LABEL_COLUMN_WIDTH }}>
        <div style={{ height: 40 }} />
        {hours.map((hour) => (
          <div
            key={hour}
            style={{ height: HOUR_HEIGHT }}
            className="relative -top-2 pr-2 text-right text-xs text-neutral-400"
          >
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {days.map((day) => {
        const dayAppointments = appointments.filter((appointment) =>
          isSameDay(appointment.start, day),
        )

        return (
          <div
            key={day.toISOString()}
            className="min-w-[120px] flex-1 border-l border-neutral-200 dark:border-neutral-800"
          >
            <div
              className={cn(
                'flex h-10 flex-col items-center justify-center border-b border-neutral-200 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400',
                isSameDay(day, today) && 'text-brand-600 dark:text-brand-400',
              )}
            >
              <span>{formatWeekdayShort(day)}</span>
              <span>{day.getDate()}</span>
            </div>

            <div
              className="relative cursor-pointer"
              style={{ height: totalHeight }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const offsetY = event.clientY - rect.top
                const minutes =
                  Math.round(((offsetY / HOUR_HEIGHT) * 60) / 15) * 15
                const clicked = new Date(day)
                clicked.setHours(GRID_START_HOUR, 0, 0, 0)
                clicked.setMinutes(clicked.getMinutes() + minutes)
                onSlotClick(clicked)
              }}
            >
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={(event) => {
                    // Real mouse clicks have detail >= 1; keyboard/AT activation has detail 0.
                    // Let mouse clicks bubble to the parent's precise (15-min) handler.
                    if (event.detail !== 0) return
                    event.stopPropagation()
                    const clicked = new Date(day)
                    clicked.setHours(hour, 0, 0, 0)
                    onSlotClick(clicked)
                  }}
                  aria-label={`Novo agendamento às ${String(hour).padStart(2, '0')}:00 em ${formatWeekdayShort(day)}`}
                  style={{ height: HOUR_HEIGHT }}
                  className="focus-visible:ring-brand-400 block w-full border-b border-neutral-100 text-left focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none dark:border-neutral-800/60"
                />
              ))}

              {dayAppointments.map((appointment) => {
                const top = Math.max(
                  0,
                  (minutesFromGridStart(appointment.start) / 60) * HOUR_HEIGHT,
                )
                const durationMinutes =
                  (appointment.end.getTime() - appointment.start.getTime()) /
                  60000
                const height = Math.max(
                  24,
                  (durationMinutes / 60) * HOUR_HEIGHT,
                )

                return (
                  <button
                    key={appointment.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onAppointmentClick(appointment)
                    }}
                    style={{ top, height }}
                    className="bg-brand-500 hover:bg-brand-600 shadow-soft absolute inset-x-1 overflow-hidden rounded-md px-2 py-1 text-left text-xs text-white"
                  >
                    <p className="truncate font-medium">{appointment.title}</p>
                    <p className="truncate text-white/80">
                      {formatTime(appointment.start)} –{' '}
                      {formatTime(appointment.end)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
