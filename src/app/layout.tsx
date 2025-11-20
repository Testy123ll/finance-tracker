import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const Navigation = dynamic(() => import('./Navigation'), { ssr: false })
const SessionTimeout = dynamic(() => import('./SessionTimeout'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Track income, expenses, budgets, goals, and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <SessionTimeout />
        <Navigation />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  )
}

function ConditionalFooter() {
  return (
    <footer className="mt-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} Finance Tracker — Track, budget, and grow.
        </p>
      </div>
    </footer>
  )
}