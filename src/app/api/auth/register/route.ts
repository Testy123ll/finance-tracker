import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { rateLimit } from '@/lib/ratelimit'
import { sendEmail } from '@/lib/notify'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, 'Name is required'),
})

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const limit = rateLimit(`register:${ip}`, 3, 300000) // 3 attempts per 5 minutes
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    )
  }

  const data = await req.json()
  const parsed = RegisterSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password, name } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash, name } })
  
  // Send verification email
  const verificationToken = signToken({ userId: user.id, email: user.email, type: 'verify' }, '24h')
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
  
  await sendEmail(
    email,
    'Verify your email - Finance Tracker',
    `Hello ${name},

Welcome to Finance Tracker! Please verify your email by clicking the link below:

${verificationLink}

This link expires in 24 hours.

Best regards,
Finance Tracker Team`
  )
  
  const token = signToken({ userId: user.id, email: user.email })
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name }, message: 'Please check your email to verify your account' })
}