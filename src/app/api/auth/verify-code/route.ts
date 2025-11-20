import { NextRequest, NextResponse } from 'next/server'
import { validateCode } from '@/lib/verification'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email: string | undefined = body.email
  const phone: string | undefined = body.phone
  const code: string | undefined = body.code
  const name: string | undefined = body.name
  if (!code || (!email && !phone)) return NextResponse.json({ error: 'Missing target or code' }, { status: 400 })

  const target = email || phone!
  const result = validateCode(target, code)
  if (!result.ok) return NextResponse.json({ error: 'Invalid or expired code', reason: result.reason }, { status: 400 })

  // Find or create user based on channel
  let user
  if (email) {
    user = await prisma.user.findUnique({ where: { email } })
    if (!user && result.purpose === 'register') {
      user = await prisma.user.create({ data: { email, name, passwordHash: 'code-auth' } })
    }
  } else {
    user = await prisma.user.findFirst({ where: { phone } })
    if (!user && result.purpose === 'register') {
      // Create user with phone - need a placeholder email
      const placeholderEmail = `${phone?.replace(/\D/g, '')}@phone.local`
      user = await prisma.user.create({ 
        data: { 
          email: placeholderEmail,
          phone, 
          name, 
          passwordHash: 'code-auth' 
        } 
      })
    }
  }

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const token = signToken({ userId: user.id, email: user.email })
  return NextResponse.json({ token })
}