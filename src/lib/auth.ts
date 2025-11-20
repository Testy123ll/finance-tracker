import jwt, { SignOptions } from 'jsonwebtoken'

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  return secret
}

export type JwtPayload = { userId: string; email: string; type?: string }

export function signToken(payload: JwtPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, getJWTSecret(), { expiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJWTSecret()) as JwtPayload
  } catch (err) {
    return null
  }
}

export function getAuthUser(req: Request): JwtPayload | null {
  const auth = req.headers instanceof Headers ? (req.headers.get('authorization') || '') : ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  return verifyToken(token)
}