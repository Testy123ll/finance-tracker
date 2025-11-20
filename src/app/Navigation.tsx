'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  // Hide nav on auth pages
  if (currentPath === '/login' || currentPath === '/register' || currentPath === '/' || currentPath === '/forgot-password' || currentPath === '/reset-password' || currentPath === '/verify-email') {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold text-lg tracking-wide hover:opacity-90">Finance Tracker</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:underline decoration-white/40 underline-offset-4">Dashboard</Link>
            <Link href="/transactions" className="hover:underline decoration-white/40 underline-offset-4">Transactions</Link>
            <Link href="/categories" className="hover:underline decoration-white/40 underline-offset-4">Categories</Link>
            <Link href="/budgets" className="hover:underline decoration-white/40 underline-offset-4">Budgets</Link>
            <Link href="/analytics" className="hover:underline decoration-white/40 underline-offset-4">Analytics</Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Transactions
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/budgets"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Budgets
            </Link>
            <Link
              href="/analytics"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
