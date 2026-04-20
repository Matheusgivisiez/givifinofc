import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/auth'
import { authenticateUser } from '@/lib/users'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const user = authenticateUser(email ?? '', password ?? '')

  if (!user) {
    return NextResponse.json({ error: 'Email ou senha invalidos.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  setAuthCookies(response, user.id)
  return response
}
