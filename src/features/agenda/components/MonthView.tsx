import { cn } from '@/utils/cn'
import { formatTime, getMonthGridDays, isSameDay } from '@/utils/date'
import type { Appointment } from '../types'

const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MAX_VISIBLE = 2

export interface MonthViewProps {
  month: Date
  appointments: Appointment[]
  onDayClick: (date: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
}

export function MonthView({
  month,
  appointments,
  onDayClick,
  onAppointmentClick,
}: MonthViewProps) {
  const days = getMonthGridDays(month)
  const today = new Date()

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-7 bg-neutral-50 text-center text-xs font-medium text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayAppointments = appointments
            .filter((appointment) => isSameDay(appointment.start, day))
            .sort((a, b) => a.start.getTime() - b.start.getTime())
          const isCurrentMonth = day.getMonth() === month.getMonth()
          const isToday = isSameDay(day, today)

          return (
            <div
              key={day.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => onDayClick(day)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onDayClick(day)
                }
              }}
              className={cn(
                'flex min-h-24 cursor-pointer flex-col gap-1 border-r border-b border-neutral-100 p-1.5 text-left dark:border-neutral-800',
                !isCurrentMonth &&
                  'bg-neutral-50/60 text-neutral-400 dark:bg-neutral-900/40',
              )}
            >
              <span
                className={cn(
                  'text-xs font-medium',
                  isToday &&
                    'bg-brand-500 flex size-5 items-center justify-center rounded-full text-white',
                )}
              >
                {day.getDate()}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayAppointments.slice(0, MAX_VISIBLE).map((appointment) => (
                  <button
                    key={appointment.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onAppointmentClick(appointment)
                    }}
                    className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 truncate rounded px-1 py-0.5 text-left text-[11px]"
                  >
                    {formatTime(appointment.start)} {appointment.title}
                  </button>
                ))}
                {dayAppointments.length > MAX_VISIBLE && (
                  <span className="text-[11px] text-neutral-400">
                    +{dayAppointments.length - MAX_VISIBLE} mais
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
