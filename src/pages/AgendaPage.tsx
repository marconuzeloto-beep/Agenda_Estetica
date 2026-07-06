import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui'
import { AgendaToolbar } from '@/features/agenda/components/AgendaToolbar'
import { AppointmentFormModal } from '@/features/agenda/components/AppointmentFormModal'
import { MonthView } from '@/features/agenda/components/MonthView'
import { TimeGridView } from '@/features/agenda/components/TimeGridView'
import {
  useCreateAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
} from '@/features/agenda/hooks/useAppointmentMutations'
import { useAppointmentsRange } from '@/features/agenda/hooks/useAppointmentsRange'
import { appointmentToFormValues } from '@/features/agenda/mappers'
import type { AppointmentFormValues } from '@/features/agenda/schemas'
import type { AgendaView, Appointment } from '@/features/agenda/types'
import {
  addDays,
  addMinutes,
  addMonths,
  endOfDay,
  endOfWeek,
  formatFullDate,
  formatMonthYear,
  formatWeekRangeLabel,
  getMonthGridDays,
  getWeekDays,
  startOfDay,
  startOfWeek,
  toDateInputValue,
  toTimeInputValue,
} from '@/utils/date'

type ModalState =
  | { mode: 'create'; initialValues: Partial<AppointmentFormValues> }
  | { mode: 'edit'; appointment: Appointment }
  | null

function parseDateParam(value: string | null): Date {
  if (!value) return new Date()
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export function AgendaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const view = (searchParams.get('view') as AgendaView | null) ?? 'week'
  const currentDate = parseDateParam(searchParams.get('date'))

  const [modalState, setModalState] = useState<ModalState>(null)

  const range = useMemo(() => {
    if (view === 'day') {
      return { start: startOfDay(currentDate), end: endOfDay(currentDate) }
    }
    if (view === 'week') {
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) }
    }
    const gridDays = getMonthGridDays(currentDate)
    return {
      start: startOfDay(gridDays[0]),
      end: endOfDay(gridDays[gridDays.length - 1]),
    }
  }, [view, currentDate])

  const { data: appointments = [], isLoading } = useAppointmentsRange(
    range.start,
    range.end,
  )

  const createMutation = useCreateAppointment()
  const updateMutation = useUpdateAppointment()
  const deleteMutation = useDeleteAppointment()

  function updateParams(next: { view?: AgendaView; date?: Date }) {
    const params = new URLSearchParams(searchParams)
    if (next.view) params.set('view', next.view)
    if (next.date) params.set('date', toDateInputValue(next.date))
    setSearchParams(params, { replace: true })
  }

  function handlePrev() {
    if (view === 'day') updateParams({ date: addDays(currentDate, -1) })
    else if (view === 'week') updateParams({ date: addDays(currentDate, -7) })
    else updateParams({ date: addMonths(currentDate, -1) })
  }

  function handleNext() {
    if (view === 'day') updateParams({ date: addDays(currentDate, 1) })
    else if (view === 'week') updateParams({ date: addDays(currentDate, 7) })
    else updateParams({ date: addMonths(currentDate, 1) })
  }

  function handleToday() {
    updateParams({ date: new Date() })
  }

  function handleViewChange(nextView: AgendaView) {
    updateParams({ view: nextView })
  }

  function handleSlotClick(date: Date) {
    setModalState({
      mode: 'create',
      initialValues: {
        date: toDateInputValue(date),
        startTime: toTimeInputValue(date),
        endTime: toTimeInputValue(addMinutes(date, 60)),
      },
    })
  }

  function handleDayClick(date: Date) {
    updateParams({ view: 'day', date })
  }

  function handleAppointmentClick(appointment: Appointment) {
    setModalState({ mode: 'edit', appointment })
  }

  function handleCreateClick() {
    handleSlotClick(view === 'day' ? currentDate : new Date())
  }

  function closeModal() {
    setModalState(null)
  }

  function handleSubmit(values: AppointmentFormValues) {
    if (modalState?.mode === 'edit') {
      updateMutation.mutate(
        { id: modalState.appointment.id, values },
        { onSuccess: closeModal },
      )
    } else {
      createMutation.mutate(values, { onSuccess: closeModal })
    }
  }

  function handleDelete() {
    if (modalState?.mode === 'edit') {
      deleteMutation.mutate(modalState.appointment.id, {
        onSuccess: closeModal,
      })
    }
  }

  const periodLabel =
    view === 'day'
      ? formatFullDate(currentDate)
      : view === 'week'
        ? formatWeekRangeLabel(startOfWeek(currentDate), endOfWeek(currentDate))
        : formatMonthYear(currentDate)

  return (
    <div className="flex flex-col gap-4">
      <AgendaToolbar
        view={view}
        periodLabel={periodLabel}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onCreate={handleCreateClick}
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando agenda" />
        </div>
      ) : view === 'month' ? (
        <MonthView
          month={currentDate}
          appointments={appointments}
          onDayClick={handleDayClick}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <TimeGridView
          days={view === 'day' ? [currentDate] : getWeekDays(currentDate)}
          appointments={appointments}
          onSlotClick={handleSlotClick}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      <AppointmentFormModal
        open={modalState !== null}
        onClose={closeModal}
        initialValues={
          modalState?.mode === 'create'
            ? modalState.initialValues
            : modalState?.mode === 'edit'
              ? appointmentToFormValues(modalState.appointment)
              : undefined
        }
        appointment={
          modalState?.mode === 'edit' ? modalState.appointment : undefined
        }
        onSubmit={handleSubmit}
        onDelete={modalState?.mode === 'edit' ? handleDelete : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
