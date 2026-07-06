import Dexie from 'dexie'

/**
 * Instância base do banco local (IndexedDB).
 * Tabelas de domínio serão adicionadas nas próximas sprints via db.version(n).stores(...).
 */
class AgendaEsteticaDB extends Dexie {
  constructor() {
    super('agenda-estetica')
  }
}

export const db = new AgendaEsteticaDB()
