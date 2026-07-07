import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Client } from '@/features/clients/types'
import { clientsRepository } from './clientsRepository'
import { db } from './db'

function makeClient(overrides: Partial<Client>): Client {
  return {
    id: 'default-id',
    name: 'Cliente',
    phone: '11999999999',
    createdAt: new Date(2026, 0, 1),
    ...overrides,
  }
}

beforeEach(async () => {
  await db.clients.clear()
})

afterEach(async () => {
  await db.clients.clear()
})

describe('clientsRepository.list', () => {
  it('returns all clients ordered by name', async () => {
    await clientsRepository.create(makeClient({ id: '1', name: 'Zeca' }))
    await clientsRepository.create(makeClient({ id: '2', name: 'Ana' }))

    const result = await clientsRepository.list()
    expect(result.map((c) => c.name)).toEqual(['Ana', 'Zeca'])
  })

  it('returns an empty array when there are no clients', async () => {
    expect(await clientsRepository.list()).toEqual([])
  })
})

describe('clientsRepository.get', () => {
  it('returns the client matching the id', async () => {
    await clientsRepository.create(makeClient({ id: '1', name: 'Ana' }))
    const client = await clientsRepository.get('1')
    expect(client?.name).toBe('Ana')
  })

  it('returns undefined for an id that does not exist', async () => {
    expect(await clientsRepository.get('missing')).toBeUndefined()
  })
})

describe('clientsRepository.update', () => {
  it('updates an existing client and returns a count of 1', async () => {
    await clientsRepository.create(makeClient({ id: '1', name: 'Ana' }))
    const count = await clientsRepository.update('1', { name: 'Ana Souza' })
    expect(count).toBe(1)
    expect((await clientsRepository.get('1'))?.name).toBe('Ana Souza')
  })

  it('returns 0 when updating an id that does not exist', async () => {
    const count = await clientsRepository.update('missing', { name: 'x' })
    expect(count).toBe(0)
  })
})

describe('clientsRepository.remove', () => {
  it('deletes an existing client', async () => {
    await clientsRepository.create(makeClient({ id: '1' }))
    await clientsRepository.remove('1')
    expect(await clientsRepository.get('1')).toBeUndefined()
  })

  it('does not throw when removing an id that does not exist', async () => {
    await expect(clientsRepository.remove('missing')).resolves.toBeUndefined()
  })
})
