import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export function getAuthenticatedUserId() {
  const cookieStore = cookies()
  const auth = cookieStore.get('auth')
  const userId = cookieStore.get('auth_user_id')

  if (auth?.value !== 'loggedin' || !userId?.value) {
    return null
  }

  return userId.value
}

export function setAuthCookies(response: NextResponse, userId: string) {
  response.cookies.set('auth', 'loggedin', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
  })

  response.cookies.set('auth_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
  })
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  })

  response.cookies.set('auth_user_id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  })
}
