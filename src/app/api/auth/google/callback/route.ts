import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET' }, { status: 500 })
  }
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/auth/google/callback`

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokenJson }, { status: 400 })
  }

  const accessToken = tokenJson.access_token
  // Get user info
  const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const info = await infoRes.json()
  if (!infoRes.ok) {
    return NextResponse.json({ error: info }, { status: 400 })
  }
  const email: string | undefined = info.email
  const name: string | undefined = info.name
  if (!email) return NextResponse.json({ error: 'Google account has no email' }, { status: 400 })

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || undefined,
        passwordHash: 'oauth-google',
      },
    })
  }

  const token = signToken({ userId: user.id, email: user.email })
  const dest = '/auth/callback?token=' + encodeURIComponent(token) + '&redirect=' + encodeURIComponent('/dashboard')
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'
  return NextResponse.redirect(base + dest)
}