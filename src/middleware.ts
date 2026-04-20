import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')
  const authUserCookie = request.cookies.get('auth_user_id')

  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    (authCookie?.value !== 'loggedin' || !authUserCookie?.value)
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
