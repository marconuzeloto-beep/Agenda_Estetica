import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AppointmentFormValues } from '@/features/agenda/schemas'
import type { ClientFormValues } from '@/features/clients/schemas'
import { agendaService } from './agendaService'
import { clientsService } from './clientsService'
import { db } from '@/repositories/db'

function makeClientValues(overrides: Partial<ClientFormValues> = {}): ClientFormValues {
  return {
    name: 'Maria Silva',
    phone: '(11) 98765-4321',
    email: '',
    birthDate: '',
    notes: '',
    ...overrides,
  }
}

function makeAppointmentValues(
  overrides: Partial<AppointmentFormValues> = {},
): AppointmentFormValues {
  return {
    title: 'Limpeza de pele',
    clientId: '',
    procedureId: '',
    date: '2026-07-08',
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
    ...overrides,
  }
}

beforeEach(async () => {
  await db.clients.clear()
  await db.appointments.clear()
})

afterEach(async () => {
  await db.clients.clear()
  await db.appointments.clear()
})

describe('clientsService.createClient', () => {
  it('creates a client with trimmed fields', async () => {
    const client = await clientsService.createClient(
      makeClientValues({ name: '  Maria Silva  ' }),
    )
    expect(client.name).toBe('Maria Silva')
    expect(client.id).toBeTruthy()
    expect(await clientsService.getClient(client.id)).toBeDefined()
  })

  it('omits optional fields when left blank', async () => {
    const client = await clientsService.createClient(makeClientValues())
    expect(client.email).toBeUndefined()
    expect(client.birthDate).toBeUndefined()
    expect(client.notes).toBeUndefined()
  })
})

describe('clientsService.updateClient', () => {
  it('updates an existing client', async () => {
    const client = await clientsService.createClient(makeClientValues())
    await clientsService.updateClient(
      client.id,
      makeClientValues({ name: 'Maria Souza' }),
    )
    expect((await clientsService.getClient(client.id))?.name).toBe('Maria Souza')
  })

  it('throws when the client id no longer exists', async () => {
    await expect(
      clientsService.updateClient('missing-id', makeClientValues()),
    ).rejects.toThrow('Cliente não encontrado.')
  })
})

describe('clientsService.deleteClient', () => {
  it('removes the client', async () => {
    const client = await clientsService.createClient(makeClientValues())
    await clientsService.deleteClient(client.id)
    expect(await clientsService.getClient(client.id)).toBeUndefined()
  })

  it('clears the clientId of linked appointments instead of leaving an orphaned reference', async () => {
    const client = await clientsService.createClient(makeClientValues())
    const appointment = await agendaService.createAppointment(
      makeAppointmentValues({ clientId: client.id }),
    )

    await clientsService.deleteClient(client.id)

    const [stored] = await agendaService.getAppointmentsInRange(
      new Date(2026, 6, 8, 0, 0),
      new Date(2026, 6, 8, 23, 59),
    )
    expect(stored.id).toBe(appointment.id)
    expect(stored.clientId).toBeUndefined()
  })
})
