import { CalendarCheck, CalendarDays, Clock, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Spinner, StatCard } from '@/components/ui'
import { PageTransition } from '@/components/layout/PageTransition'
import { UpcomingAppointmentsCard } from '@/features/dashboard/components/UpcomingAppointmentsCard'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { formatTime } from '@/utils/date'

export function DashboardPage() {
  const { todayCount, weekCount, nextAppointment, upcoming, isLoading } =
    useDashboardStats()

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Olá!
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Aqui está o resumo da sua agenda.
          </p>
        </div>
        <Link
          to="/agenda?view=day"
          className="bg-brand-500 hover:bg-brand-600 focus-visible:ring-brand-400 inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Plus className="size-4" aria-hidden="true" />
          Novo agendamento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Hoje" value={todayCount} icon={CalendarDays} />
        <StatCard
          label="Esta semana"
          value={weekCount}
          icon={CalendarCheck}
          accent="success"
        />
        <StatCard
          label="Próximo horário"
          value={nextAppointment ? formatTime(nextAppointment.start) : '—'}
          icon={Clock}
          accent="warning"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner label="Carregando" />
        </div>
      ) : (
        <UpcomingAppointmentsCard appointments={upcoming} />
      )}
    </PageTransition>
  )
}
