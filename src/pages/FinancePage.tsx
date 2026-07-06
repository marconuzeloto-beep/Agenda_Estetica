import { DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  Spinner,
  StatCard,
  Tabs,
} from '@/components/ui'
import { PageTransition } from '@/components/layout/PageTransition'
import { RevenueChart } from '@/features/finance/components/RevenueChart'
import { useFinanceData } from '@/features/finance/hooks/useFinanceData'
import {
  getDailyRevenueSeries,
  getFinanceSummary,
  getMonthlyRevenueSeries,
  getWeeklyRevenueSeries,
} from '@/features/finance/utils'
import { formatCurrency } from '@/utils/currency'
import {
  formatDayMonth,
  formatMonthShort,
  formatWeekdayShort,
} from '@/utils/date'

type Granularity = 'day' | 'week' | 'month'

const GRANULARITY_ITEMS: { value: Granularity; label: string }[] = [
  { value: 'day', label: 'Diário' },
  { value: 'week', label: 'Semanal' },
  { value: 'month', label: 'Mensal' },
]

export function FinancePage() {
  const now = useMemo(() => new Date(), [])
  const { appointments, priceByProcedureId, isLoading } = useFinanceData(now)
  const [granularity, setGranularity] = useState<Granularity>('day')

  const summary = useMemo(
    () => getFinanceSummary(appointments, priceByProcedureId, now),
    [appointments, priceByProcedureId, now],
  )

  const chartPoints = useMemo(() => {
    if (granularity === 'day') {
      return getDailyRevenueSeries(appointments, priceByProcedureId, now).map(
        (point) => ({
          label: formatWeekdayShort(point.date),
          value: point.total,
        }),
      )
    }
    if (granularity === 'week') {
      return getWeeklyRevenueSeries(appointments, priceByProcedureId, now).map(
        (point) => ({
          label: formatDayMonth(point.weekStart),
          value: point.total,
        }),
      )
    }
    return getMonthlyRevenueSeries(appointments, priceByProcedureId, now).map(
      (point) => ({
        label: formatMonthShort(point.monthStart),
        value: point.total,
      }),
    )
  }, [granularity, appointments, priceByProcedureId, now])

  return (
    <PageTransition>
      <div>
        <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Financeiro
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Faturamento calculado a partir dos procedimentos vinculados aos
          agendamentos.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando financeiro" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard
              label="Hoje"
              value={formatCurrency(summary.todayTotal)}
              icon={Wallet}
            />
            <StatCard
              label="Esta semana"
              value={formatCurrency(summary.weekTotal)}
              icon={TrendingUp}
              accent="success"
            />
            <StatCard
              label="Este mês"
              value={formatCurrency(summary.monthTotal)}
              icon={DollarSign}
              accent="warning"
            />
            <StatCard
              label="Ticket médio"
              value={formatCurrency(summary.averageTicket)}
              icon={Receipt}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <Tabs
                items={GRANULARITY_ITEMS}
                value={granularity}
                onChange={setGranularity}
              />
            </CardHeader>
            <RevenueChart points={chartPoints} />
          </Card>
        </>
      )}
    </PageTransition>
  )
}
