import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUserId } from '@/lib/auth'
import { getProfile, setProfile } from '@/lib/profile'

export async function GET() {
  try {
    const userId = getAuthenticatedUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile(userId)
    return NextResponse.json(profile)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, photoUrl } = await request.json()
    const updatedProfile = await setProfile(userId, {
      name: typeof name === 'string' ? name : '',
      email: typeof email === 'string' ? email : '',
      photoUrl: typeof photoUrl === 'string' ? photoUrl : '',
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
