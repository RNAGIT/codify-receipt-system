/**
 * API Route for sending receipt emails
 * POST /api/send-email
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendReceiptEmail } from '@/lib/emailService'
import { Receipt } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const receipt: Receipt = body.receipt

    // Validate receipt data
    if (!receipt || !receipt.clientEmail) {
      return NextResponse.json(
        { error: 'Invalid receipt data or missing client email' },
        { status: 400 }
      )
    }

    // Send email
    await sendReceiptEmail(receipt)

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${receipt.clientEmail}`,
    })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send email. Please check your email configuration.',
      },
      { status: 500 }
    )
  }
}

