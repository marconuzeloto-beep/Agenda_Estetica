export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  /** Data de nascimento no formato yyyy-mm-dd (valor nativo de input[type=date]). */
  birthDate?: string
  notes?: string
  createdAt: Date
}
