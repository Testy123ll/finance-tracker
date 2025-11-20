import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'

const VerifyEmailSchema = z.object({
  token: z.string(),
})

export async function POST(req: NextRequest) {
  const data = await req.json()
  const parsed = VerifyEmailSchema.safeParse(data)
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { token } = parsed.data
  
  // Verify token
  const payload = verifyToken(token)
  
  if (!payload || payload.type !== 'verify') {
    return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
  }

  // Update user as verified
  await prisma.user.update({
    where: { id: payload.userId },
    data: { isVerified: true },
  })

  return NextResponse.json({ message: 'Email verified successfully' })
}
