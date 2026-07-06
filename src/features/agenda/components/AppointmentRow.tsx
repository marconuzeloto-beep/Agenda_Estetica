import { formatFullDate, formatTime } from '@/utils/date'
import type { Appointment } from '../types'

export interface AppointmentRowProps {
  appointment: Appointment
  onClick?: () => void
}

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  const content = (
    <>
      <div>
        <p className="font-medium text-neutral-800 dark:text-neutral-100">
          {appointment.title}
        </p>
        <p className="text-neutral-500 dark:text-neutral-400">
          {formatFullDate(appointment.start)}
        </p>
      </div>
      <span className="text-brand-600 dark:text-brand-400 font-medium">
        {formatTime(appointment.start)}
      </span>
    </>
  )

  if (!onClick) {
    return (
      <li className="flex items-center justify-between gap-3 py-2 text-sm">
        {content}
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        {content}
      </button>
    </li>
  )
}
