import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'

const UpdateSchema = z.object({
  amount: z.number().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  note: z.string().optional(),
  categoryId: z.string().optional(),
  date: z.string().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req as unknown as Request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const parsed = UpdateSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : undefined,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req as unknown as Request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.transaction.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}