import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const dataDir = path.join(process.cwd(), 'data')
const transactionsFile = path.join(dataDir, 'transactions.json')

async function ensureTransactionsFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    try {
      await fs.access(transactionsFile)
    } catch {
      await fs.writeFile(transactionsFile, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error initializing transactions file:', error)
  }
}

// Initialize on module load
ensureTransactionsFile().catch(console.error)

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    await ensureTransactionsFile()
    const data = await fs.readFile(transactionsFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading transactions:', error)
    return []
  }
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  try {
    if (transaction.amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }
    
    const transactions = await getTransactions()
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    }
    transactions.push(newTransaction)
    await ensureTransactionsFile()
    await fs.writeFile(transactionsFile, JSON.stringify(transactions, null, 2))
    return newTransaction
  } catch (error) {
    console.error('Error adding transaction:', error)
    throw error
  }
}

export async function getBalance(): Promise<number> {
  try {
    const transactions = await getTransactions()
    return transactions.reduce((balance, t) => {
      return t.type === 'income' ? balance + t.amount : balance - t.amount
    }, 0)
  } catch (error) {
    console.error('Error calculating balance:', error)
    return 0
  }
}