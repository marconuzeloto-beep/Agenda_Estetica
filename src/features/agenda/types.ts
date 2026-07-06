export interface Appointment {
  id: string
  /** Nome do serviço realizado. */
  title: string
  /** Vínculo opcional com um cliente cadastrado. */
  clientId?: string
  /** Vínculo opcional com um procedimento do catálogo (usado no Financeiro). */
  procedureId?: string
  start: Date
  end: Date
  notes?: string
}

export type AgendaView = 'day' | 'week' | 'month'
