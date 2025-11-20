import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'

const CreateSchema = z.object({
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE']),
  note: z.string().optional(),
  categoryId: z.string().optional(),
  date: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const user = getAuthUser(req as unknown as Request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const list = await prisma.transaction.findMany({
    where: { userId: user.userId },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req as unknown as Request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const parsed = CreateSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { amount, type, note, categoryId, date } = parsed.data
  const created = await prisma.transaction.create({
    data: {
      userId: user.userId,
      amount: amount,
      type,
      note,
      categoryId,
      date: date ? new Date(date) : new Date(),
    },
  })
  return NextResponse.json(created, { status: 201 })
}