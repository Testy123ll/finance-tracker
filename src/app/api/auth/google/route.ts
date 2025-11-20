import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID' }, { status: 500 })
  }
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/auth/google/callback`
  const scope = encodeURIComponent('openid email profile')
  const state = 'state-' + Math.random().toString(36).slice(2)
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=consent&state=${state}`
  return NextResponse.redirect(url)
}