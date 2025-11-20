import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/notify'
import { signToken } from '@/lib/auth'
import { rateLimit } from '@/lib/ratelimit'

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const limit = rateLimit(`forgot-password:${ip}`, 3, 600000) // 3 attempts per 10 minutes
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many password reset attempts. Please try again later.' },
      { status: 429 }
    )
  }

  const data = await req.json()
  const parsed = ForgotPasswordSchema.safeParse(data)
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { email } = parsed.data
  
  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  
  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ message: 'If email exists, reset link sent' })
  }

  // Generate reset token (valid for 1 hour)
  const resetToken = signToken({ userId: user.id, email: user.email, type: 'reset' }, '1h')
  
  // Send email
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  await sendEmail(
    email,
    'Password Reset - Finance Tracker',
    `Hello ${user.name || 'User'},

You requested to reset your password. Click the link below to reset it:

${resetLink}

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Finance Tracker Team`
  )

  return NextResponse.json({ message: 'If email exists, reset link sent' })
}
