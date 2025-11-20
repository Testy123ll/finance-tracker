import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { verifyToken } from '@/lib/auth'
import { rateLimit } from '@/lib/ratelimit'

const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const limit = rateLimit(`reset-password:${ip}`, 5, 600000) // 5 attempts per 10 minutes
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many reset attempts. Please try again later.' },
      { status: 429 }
    )
  }

  const data = await req.json()
  const parsed = ResetPasswordSchema.safeParse(data)
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { token, password } = parsed.data
  
  // Verify token
  const payload = verifyToken(token)
  
  if (!payload || payload.type !== 'reset') {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 10)
  
  // Update user password
  await prisma.user.update({
    where: { id: payload.userId },
    data: { passwordHash },
  })

  return NextResponse.json({ message: 'Password reset successfully' })
}
