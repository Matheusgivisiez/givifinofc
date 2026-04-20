import { NextRequest, NextResponse } from 'next/server'
import { requestPasswordReset } from '@/lib/users'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const result = requestPasswordReset(email ?? '')

    return NextResponse.json({
      success: true,
      message: 'Se o email existir, um codigo foi gerado para redefinir a senha.',
      previewCode: result.previewCode,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nao foi possivel gerar o codigo.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
