/**
 * Authentication utilities
 * Simple session-based authentication using localStorage
 */

export interface User {
  username: string
  password: string
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('codify-authenticated') === 'true'
}

/**
 * Authenticate user with credentials
 * Note: This function is not used - authentication is handled via API route
 * Kept for backward compatibility
 */
export function login(username: string, password: string): boolean {
  // This function is deprecated - use API route /api/auth/login instead
  // Authentication is handled server-side via API route
  if (typeof window === 'undefined') return false
  
  // This should not be called directly - use API route
  console.warn('Direct login() call is deprecated. Use API route instead.')
  return false
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('codify-authenticated')
  localStorage.removeItem('codify-username')
}

/**
 * Get current username
 */
export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('codify-username')
}

