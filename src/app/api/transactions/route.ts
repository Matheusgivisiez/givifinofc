import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUserId } from '@/lib/auth'
import { addTransaction, getBalance, getTransactions, Transaction } from '@/lib/transactions'

export async function GET() {
  try {
    const userId = getAuthenticatedUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await getTransactions(userId)
    const balance = await getBalance(userId)

    return NextResponse.json({ transactions, balance })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, amount, description }: Omit<Transaction, 'id' | 'date' | 'userId'> = await request.json()

    if (!type || amount === undefined || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description cannot be empty' }, { status: 400 })
    }

    const newTransaction = await addTransaction({
      userId,
      type,
      amount: parsedAmount,
      description: description.trim(),
      date: new Date().toISOString(),
    })

    return NextResponse.json(newTransaction)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
