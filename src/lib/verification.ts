type CodeRecord = { code: string; expiresAt: number; purpose: 'login'|'register'; channel: 'email'|'phone' }

const store = new Map<string, CodeRecord>() // key is email or phone

export function generateCode(target: string, purpose: 'login'|'register', channel: 'email'|'phone'): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  store.set(target, { code, expiresAt, purpose, channel })
  return code
}

export function validateCode(target: string, code: string) {
  const rec = store.get(target)
  if (!rec) return { ok: false, reason: 'not_found' as const }
  if (Date.now() > rec.expiresAt) {
    store.delete(target)
    return { ok: false, reason: 'expired' as const }
  }
  const ok = rec.code === code
  if (ok) store.delete(target)
  return { ok, purpose: rec.purpose, channel: rec.channel }
}