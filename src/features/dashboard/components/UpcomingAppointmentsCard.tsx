import { CalendarClock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui'
import { AppointmentRow } from '@/features/agenda/components/AppointmentRow'
import type { Appointment } from '@/features/agenda/types'

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
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </ul>
      )}
    </Card>
  )
}
