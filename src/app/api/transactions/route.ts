import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getTransactions, addTransaction, getBalance, Transaction } from '@/lib/transactions'

export async function GET() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('auth')

    if (auth?.value !== 'loggedin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await getTransactions()
    const balance = await getBalance()

    return NextResponse.json({ transactions, balance })
  } catch (error) {
    console.error('Error in GET /api/transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('auth')

    if (auth?.value !== 'loggedin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, amount, description }: Omit<Transaction, 'id' | 'date'> = await request.json()

    if (!type || amount === undefined || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description cannot be empty' }, { status: 400 })
    }

    const newTransaction = await addTransaction({
      type,
      amount: parsedAmount,
      description: description.trim(),
      date: new Date().toISOString(),
    })

    return NextResponse.json(newTransaction)
  } catch (error) {
    console.error('Error in POST /api/transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}