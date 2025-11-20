'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SessionTimeout() {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
    
    // Don't run on public pages
    if (publicPaths.includes(pathname)) {
      return
    }

    let timeoutId: NodeJS.Timeout
    let warningTimeoutId: NodeJS.Timeout

    const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes
    const WARNING_DURATION = 28 * 60 * 1000 // 28 minutes (2 min warning)

    const resetTimer = () => {
      clearTimeout(timeoutId)
      clearTimeout(warningTimeoutId)

      // Show warning 2 minutes before timeout
      warningTimeoutId = setTimeout(() => {
        toast('Your session will expire in 2 minutes due to inactivity', {
          duration: 120000,
          icon: '⚠️',
        })
      }, WARNING_DURATION)

      // Logout after 30 minutes of inactivity
      timeoutId = setTimeout(() => {
        localStorage.removeItem('token')
        toast.error('Session expired due to inactivity')
        router.push('/login')
      }, TIMEOUT_DURATION)
    }

    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer)
    })

    // Initialize timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
      clearTimeout(timeoutId)
      clearTimeout(warningTimeoutId)
    }
  }, [router, pathname])

  return null
}
