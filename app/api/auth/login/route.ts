/**
 * API Route for authentication
 * POST /api/auth/login
 * 
 * Hardcoded credentials for login (fallback if env not set)
 */

import { NextRequest, NextResponse } from 'next/server'

// Hardcoded credentials (used as fallback if environment variables are not set)
const HARDCODED_USERNAME_1 = 'admin'
const HARDCODED_PASSWORD_1 = 'Codify@26'
const HARDCODED_USERNAME_2 = 'user'
const HARDCODED_PASSWORD_2 = 'user123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get credentials from environment variables first, fallback to hardcoded variables
    const validUsers = [
      // User 1: From env or hardcoded variable
      {
        username: process.env.USERNAME_1 || HARDCODED_USERNAME_1,
        password: process.env.PASSWORD_1 || HARDCODED_PASSWORD_1,
      },
      // User 2: From env or hardcoded variable (optional)
      ...(process.env.USERNAME_2 && process.env.PASSWORD_2
        ? [
            {
              username: process.env.USERNAME_2,
              password: process.env.PASSWORD_2,
            },
          ]
        : [
            {
              username: HARDCODED_USERNAME_2,
              password: HARDCODED_PASSWORD_2,
            },
          ]),
    ].filter((user) => user.username && user.password)

    // Check if credentials match
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
      })
    } else {
      return NextResponse.json(
        {
          error: 'Invalid username or password. Please check your credentials.',
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

