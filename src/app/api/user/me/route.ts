import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = getAuthUser(req as unknown as Request)
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isVerified: true,
      createdAt: true,
    },
  })

  if (!userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user: userData })
}
