import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getProfile, setProfile, Profile } from '@/lib/profile'

export async function GET() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('auth')

    if (auth?.value !== 'loggedin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error in GET /api/profile:', error)
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

    const { name, photoUrl }: Profile = await request.json()

    if (!name || !photoUrl || typeof name !== 'string' || typeof photoUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
    }

    if (name.trim().length === 0) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
    }

    await setProfile({ name: name.trim(), photoUrl: photoUrl.trim() })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}