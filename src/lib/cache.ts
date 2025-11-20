// Simple localStorage-backed cache and offline queue
export function cacheGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function cacheSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

type QueuedRequest = { url: string; method: string; body?: any }

const QUEUE_KEY = 'offlineQueue'

export function queueRequest(req: QueuedRequest) {
  const q = cacheGet<QueuedRequest[]>(QUEUE_KEY, [])
  q.push(req)
  cacheSet(QUEUE_KEY, q)
}

export async function flushQueue() {
  const q = cacheGet<QueuedRequest[]>(QUEUE_KEY, [])
  const remaining: QueuedRequest[] = []
  for (const item of q) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: item.body ? JSON.stringify(item.body) : undefined,
      })
    } catch {
      remaining.push(item)
    }
  }
  cacheSet(QUEUE_KEY, remaining)
}