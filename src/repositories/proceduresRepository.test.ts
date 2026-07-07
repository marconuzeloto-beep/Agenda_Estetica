import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Procedure } from '@/features/procedures/types'
import { db } from './db'
import { proceduresRepository } from './proceduresRepository'

function makeProcedure(overrides: Partial<Procedure>): Procedure {
  return {
    id: 'default-id',
    name: 'Procedimento',
    category: 'Rosto',
    durationMinutes: 60,
    price: 100,
    createdAt: new Date(2026, 0, 1),
    ...overrides,
  }
}

beforeEach(async () => {
  await db.procedures.clear()
})

afterEach(async () => {
  await db.procedures.clear()
})

describe('proceduresRepository.list', () => {
  it('returns all procedures ordered by name', async () => {
    await proceduresRepository.create(makeProcedure({ id: '1', name: 'Zumba facial' }))
    await proceduresRepository.create(makeProcedure({ id: '2', name: 'Limpeza de pele' }))

    const result = await proceduresRepository.list()
    expect(result.map((p) => p.name)).toEqual(['Limpeza de pele', 'Zumba facial'])
  })

  it('returns an empty array when there are no procedures', async () => {
    expect(await proceduresRepository.list()).toEqual([])
  })
})

describe('proceduresRepository.get', () => {
  it('returns the procedure matching the id', async () => {
    await proceduresRepository.create(makeProcedure({ id: '1', name: 'Limpeza' }))
    const procedure = await proceduresRepository.get('1')
    expect(procedure?.name).toBe('Limpeza')
  })

  it('returns undefined for an id that does not exist', async () => {
    expect(await proceduresRepository.get('missing')).toBeUndefined()
  })
})

describe('proceduresRepository.update', () => {
  it('updates an existing procedure and returns a count of 1', async () => {
    await proceduresRepository.create(makeProcedure({ id: '1', price: 100 }))
    const count = await proceduresRepository.update('1', { price: 120 })
    expect(count).toBe(1)
    expect((await proceduresRepository.get('1'))?.price).toBe(120)
  })

  it('returns 0 when updating an id that does not exist', async () => {
    const count = await proceduresRepository.update('missing', { price: 1 })
    expect(count).toBe(0)
  })
})

describe('proceduresRepository.remove', () => {
  it('deletes an existing procedure', async () => {
    await proceduresRepository.create(makeProcedure({ id: '1' }))
    await proceduresRepository.remove('1')
    expect(await proceduresRepository.get('1')).toBeUndefined()
  })

  it('does not throw when removing an id that does not exist', async () => {
    await expect(proceduresRepository.remove('missing')).resolves.toBeUndefined()
  })
})
