export interface Procedure {
  id: string
  name: string
  category: string
  durationMinutes: number
  price: number
  notes?: string
  createdAt: Date
}
