import type { Client } from './types'

export function filterClients(clients: Client[], query: string): Client[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return clients

  const digits = normalized.replace(/\D/g, '')

  return clients.filter((client) => {
    if (client.name.toLowerCase().includes(normalized)) return true
    if (digits && client.phone.replace(/\D/g, '').includes(digits)) return true
    return false
  })
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function formatBirthDate(birthDate: string): string {
  const [year, month, day] = birthDate.split('-')
  if (!year || !month || !day) return birthDate
  return `${day}/${month}/${year}`
}
