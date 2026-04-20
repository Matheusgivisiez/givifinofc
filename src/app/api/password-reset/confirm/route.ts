import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithCode } from '@/lib/users'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json()

    resetPasswordWithCode({
      email: email ?? '',
      code: code ?? '',
      password: password ?? '',
    })

    return NextResponse.json({ success: true, message: 'Senha redefinida com sucesso.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nao foi possivel redefinir a senha.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
