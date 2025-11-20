import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { signToken } from '@/lib/auth'
import { rateLimit } from '@/lib/ratelimit'

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const limit = rateLimit(`login:${ip}`, 5, 60000)
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    )
  }

  const data = await req.json()
  const parsed = LoginSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const token = signToken({ userId: user.id, email: user.email })
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } })
}