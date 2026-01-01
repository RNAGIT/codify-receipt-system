'use client'

/**
 * AuthGuard Component
 * Protects routes by checking authentication status
 */

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Wait for component to mount before checking auth
    if (!mounted) return

    // Don't check auth on login page
    if (pathname === '/login') {
      // If already authenticated, redirect to dashboard
      if (isAuthenticated()) {
        router.push('/dashboard')
      } else {
        setIsChecking(false)
      }
      return
    }

    // Check authentication for all other pages
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [router, pathname, mounted])

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

