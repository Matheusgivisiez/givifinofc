import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/auth'
import { createUser } from '@/lib/users'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    const user = createUser({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
    })

    const response = NextResponse.json({ success: true }, { status: 201 })
    setAuthCookies(response, user.id)
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nao foi possivel cadastrar.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
