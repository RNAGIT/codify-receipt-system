'use client'

/**
 * LogoutButton Component
 * Displays logout button in navigation
 */

import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth'
import { useState, useEffect } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setUsername(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex items-center gap-3">
      {username && (
        <span className="text-sm text-gray-300 hidden md:block">
          {username}
        </span>
      )}
      <button
        onClick={handleLogout}
        className="px-4 py-2 border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
      >
        Logout
      </button>
    </div>
  )
}

