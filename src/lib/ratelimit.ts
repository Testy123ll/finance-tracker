// Simple in-memory rate limiter
type RateLimitRecord = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = store.get(identifier)

  // Clean up expired records
  if (record && now > record.resetAt) {
    store.delete(identifier)
  }

  const current = store.get(identifier)

  if (!current) {
    const resetAt = now + windowMs
    store.set(identifier, { count: 1, resetAt })
    return { success: true, remaining: maxRequests - 1, resetAt }
  }

  if (current.count >= maxRequests) {
    return { success: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count++
  return { success: true, remaining: maxRequests - current.count, resetAt: current.resetAt }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) {
      store.delete(key)
    }
  }
}, 60000) // Run every minute
