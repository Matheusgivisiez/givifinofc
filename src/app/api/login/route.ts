import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  if (username === 'admin' && password === 'admin') {
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth', 'loggedin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    })
    return response
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}