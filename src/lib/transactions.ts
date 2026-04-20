import crypto from 'crypto'
import { db } from '@/lib/db'

export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const rows = db.prepare(`
    SELECT id, user_id, type, amount, description, date
    FROM transactions
    WHERE user_id = ?
    ORDER BY date DESC, rowid DESC
  `).all(userId) as Array<{
    id: string
    user_id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    date: string
  }>

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: row.amount,
    description: row.description,
    date: row.date,
  }))
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (transaction.amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const id = crypto.randomUUID()

  db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount, description, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    transaction.userId,
    transaction.type,
    transaction.amount,
    transaction.description,
    transaction.date,
  )

  return {
    ...transaction,
    id,
  }
}

export async function getBalance(userId: string): Promise<number> {
  const row = db.prepare(`
    SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
    FROM transactions
    WHERE user_id = ?
  `).get(userId) as { balance: number }

  return row.balance
}
