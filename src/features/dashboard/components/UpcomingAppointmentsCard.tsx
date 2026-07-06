import { CalendarClock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui'
import type { Appointment } from '@/features/agenda/types'
import { formatFullDate, formatTime } from '@/utils/date'

export interface UpcomingAppointmentsCardProps {
  appointments: Appointment[]
}

export function UpcomingAppointmentsCard({
  appointments,
}: UpcomingAppointmentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos agendamentos</CardTitle>
        <CalendarClock className="text-brand-500 size-5" aria-hidden="true" />
      </CardHeader>
      {appointments.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Nenhum agendamento por vir.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex items-center justify-between py-2 text-sm"
            >
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
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
