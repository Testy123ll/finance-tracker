import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CheckEmailSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const data = await req.json()
  const parsed = CheckEmailSchema.safeParse(data)
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { email } = parsed.data
  
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  return NextResponse.json({ exists: !!existing })
}
