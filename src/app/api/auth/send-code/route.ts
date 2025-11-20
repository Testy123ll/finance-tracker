import { NextRequest, NextResponse } from 'next/server'
import { generateCode } from '@/lib/verification'
import { sendEmail, sendSMS } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email: string | undefined = body.email
  const phone: string | undefined = body.phone
  const purpose: 'login'|'register' = body.purpose === 'register' ? 'register' : 'login'
  if (!email && !phone) return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 })

  const target = email || phone!
  const channel = email ? 'email' : 'phone'
  const code = generateCode(target, purpose, channel)

  try {
    if (channel === 'email') {
      await sendEmail(email!, 'Your verification code', `Your code is ${code}. It expires in 10 minutes.`)
    } else {
      await sendSMS(phone!, `Your verification code is ${code}. It expires in 10 minutes.`)
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}