import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui'
import { AgendaFilters } from '@/features/agenda/components/AgendaFilters'
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
import { filterAppointments } from '@/features/agenda/utils'
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
  const clientFilter = searchParams.get('client') ?? ''

  const [searchFilter, setSearchFilter] = useState('')
  const [modalState, setModalState] = useState<ModalState>(null)
  const [submitError, setSubmitError] = useState<string>()

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

  const filteredAppointments = useMemo(
    () =>
      filterAppointments(appointments, {
        clientId: clientFilter || undefined,
        search: searchFilter,
      }),
    [appointments, clientFilter, searchFilter],
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

  function handleClientFilterChange(nextClientId: string) {
    const params = new URLSearchParams(searchParams)
    if (nextClientId) params.set('client', nextClientId)
    else params.delete('client')
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

  function openModal(state: ModalState) {
    setSubmitError(undefined)
    setModalState(state)
  }

  function handleSlotClick(date: Date) {
    openModal({
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
    openModal({ mode: 'edit', appointment })
  }

  function handleCreateClick() {
    handleSlotClick(view === 'day' ? currentDate : new Date())
  }

  function closeModal() {
    setModalState(null)
    setSubmitError(undefined)
  }

  function handleSubmit(values: AppointmentFormValues) {
    setSubmitError(undefined)
    if (modalState?.mode === 'edit') {
      updateMutation.mutate(
        { id: modalState.appointment.id, values },
        {
          onSuccess: closeModal,
          onError: (error) => setSubmitError(error.message),
        },
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: closeModal,
        onError: (error) => setSubmitError(error.message),
      })
    }
  }

  function handleDelete() {
    if (modalState?.mode === 'edit') {
      deleteMutation.mutate(modalState.appointment.id, {
        onSuccess: closeModal,
        onError: (error) => setSubmitError(error.message),
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

      <AgendaFilters
        clientId={clientFilter}
        onClientChange={handleClientFilterChange}
        search={searchFilter}
        onSearchChange={setSearchFilter}
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando agenda" />
        </div>
      ) : view === 'month' ? (
        <MonthView
          month={currentDate}
          appointments={filteredAppointments}
          onDayClick={handleDayClick}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <TimeGridView
          days={view === 'day' ? [currentDate] : getWeekDays(currentDate)}
          appointments={filteredAppointments}
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
        error={submitError}
      />
    </div>
  )
}
