import fs from 'fs'
import path from 'path'
import { DatabaseSync } from 'node:sqlite'

const dataDir = path.join(process.cwd(), 'data')
const databasePath = path.join(dataDir, 'givifin.db')

declare global {
  var __givifinDb: DatabaseSync | undefined
}

function initializeDatabase(database: DatabaseSync) {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      photo_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      used_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)
}

function createDatabase() {
  fs.mkdirSync(dataDir, { recursive: true })
  const database = new DatabaseSync(databasePath)
  initializeDatabase(database)
  return database
}

export const db = globalThis.__givifinDb ?? createDatabase()

if (!globalThis.__givifinDb) {
  globalThis.__givifinDb = db
}

export function withTransaction<T>(callback: () => T) {
  db.exec('BEGIN')

  try {
    const result = callback()
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function getMetaValue(key: string) {
  const row = db.prepare('SELECT value FROM app_meta WHERE key = ?').get(key) as { value: string } | undefined
  return row?.value ?? null
}

export function setMetaValue(key: string, value: string) {
  db.prepare(`
    INSERT INTO app_meta (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value)
}

export function importLegacyJsonToUser(userId: string) {
  const alreadyImported = getMetaValue('legacy_json_imported')
  if (alreadyImported === '1') {
    return
  }

  const legacyProfilePath = path.join(dataDir, 'profile.json')
  const legacyTransactionsPath = path.join(dataDir, 'transactions.json')

  let importedSomething = false

  if (fs.existsSync(legacyProfilePath)) {
    const rawProfile = fs.readFileSync(legacyProfilePath, 'utf8')
    const profile = JSON.parse(rawProfile) as { photoUrl?: string }

    if (typeof profile.photoUrl === 'string' && profile.photoUrl.trim().length > 0) {
      db.prepare('UPDATE users SET photo_url = ? WHERE id = ?').run(profile.photoUrl, userId)
      importedSomething = true
    }
  }

  if (fs.existsSync(legacyTransactionsPath)) {
    const rawTransactions = fs.readFileSync(legacyTransactionsPath, 'utf8')
    const transactions = JSON.parse(rawTransactions) as Array<{
      id?: string
      type?: 'income' | 'expense'
      amount?: number
      description?: string
      date?: string
    }>

    const insertStatement = db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    for (const transaction of transactions) {
      if (
        !transaction.id ||
        !transaction.type ||
        typeof transaction.amount !== 'number' ||
        !transaction.description ||
        !transaction.date
      ) {
        continue
      }

      insertStatement.run(
        transaction.id,
        userId,
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.date,
      )
      importedSomething = true
    }
  }

  if (importedSomething) {
    setMetaValue('legacy_json_imported', '1')
  }
}
