import type { ClientFormValues } from '@/features/clients/schemas'
import type { Client } from '@/features/clients/types'
import { appointmentsRepository } from '@/repositories/appointmentsRepository'
import { clientsRepository } from '@/repositories/clientsRepository'

export const clientsService = {
  listClients(): Promise<Client[]> {
    return clientsRepository.list()
  },

  getClient(id: string): Promise<Client | undefined> {
    return clientsRepository.get(id)
  },

  async createClient(values: ClientFormValues): Promise<Client> {
    const client: Client = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      birthDate: values.birthDate || undefined,
      notes: values.notes?.trim() || undefined,
      createdAt: new Date(),
    }
    await clientsRepository.create(client)
    return client
  },

  async updateClient(id: string, values: ClientFormValues): Promise<void> {
    await clientsRepository.update(id, {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      birthDate: values.birthDate || undefined,
      notes: values.notes?.trim() || undefined,
    })
  },

  async deleteClient(id: string): Promise<void> {
    await appointmentsRepository.clearClientReference(id)
    await clientsRepository.remove(id)
  },
}
