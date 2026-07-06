export interface Appointment {
  id: string
  /** Nome do serviço/cliente em texto livre até a Agenda ganhar cadastro de clientes. */
  title: string
  start: Date
  end: Date
  notes?: string
}

export type AgendaView = 'day' | 'week' | 'month'
