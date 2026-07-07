import { describe, expect, it } from 'vitest'
import { appointmentToFormValues } from './mappers'
import type { Appointment } from './types'

describe('appointmentToFormValues', () => {
  it('maps an appointment with client/procedure/notes into form values', () => {
    const appointment: Appointment = {
      id: '1',
      title: 'Limpeza de pele',
      clientId: 'client-1',
      procedureId: 'procedure-1',
      start: new Date(2026, 6, 10, 9, 0),
      end: new Date(2026, 6, 10, 10, 0),
      notes: 'Pele sensível',
    }

    expect(appointmentToFormValues(appointment)).toEqual({
      title: 'Limpeza de pele',
      clientId: 'client-1',
      procedureId: 'procedure-1',
      date: '2026-07-10',
      startTime: '09:00',
      endTime: '10:00',
      notes: 'Pele sensível',
    })
  })

  it('falls back to empty strings for optional fields when absent', () => {
    const appointment: Appointment = {
      id: '2',
      title: 'Massagem',
      start: new Date(2026, 6, 10, 14, 30),
      end: new Date(2026, 6, 10, 15, 30),
    }

    expect(appointmentToFormValues(appointment)).toEqual({
      title: 'Massagem',
      clientId: '',
      procedureId: '',
      date: '2026-07-10',
      startTime: '14:30',
      endTime: '15:30',
      notes: '',
    })
  })
})
