"use client"
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const redirect = params.get('redirect') || '/dashboard'
    if (token) {
      localStorage.setItem('token', token)
      router.replace(redirect)
    }
  }, [params, router])

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold">Signing you in…</h1>
      <p className="text-sm text-gray-600">Please wait while we complete authentication.</p>
    </section>
  )
}