import type { ClientFormValues } from './schemas'
import type { Client } from './types'

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    name: client.name,
    phone: client.phone,
    email: client.email ?? '',
    birthDate: client.birthDate ?? '',
    notes: client.notes ?? '',
  }
}
