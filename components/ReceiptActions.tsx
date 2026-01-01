'use client'

/**
 * ReceiptActions Component
 * Handles Print, PDF Download, and Email actions
 */

import { useState } from 'react'
import { Receipt } from '@/lib/types'
import { generatePDF, downloadPDF } from '@/lib/pdfGenerator'
import { sendReceiptEmail } from '@/lib/emailService'

interface ReceiptActionsProps {
  receipt: Receipt
}

export default function ReceiptActions({ receipt }: ReceiptActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePrint = () => {
    // Find the receipt preview element
    const receiptElement = document.getElementById('receipt-preview')
    if (!receiptElement) {
      alert('Receipt preview not found')
      return
    }

    // Use browser's native print
    window.print()
  }

  const handleDownloadPDF = async () => {
    // Find the receipt preview element
    const receiptElement = document.getElementById('receipt-preview')
    if (!receiptElement) {
      setMessage({ type: 'error', text: 'Receipt preview not found' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await downloadPDF(receiptElement, `receipt-${receipt.receiptNumber}.pdf`)
      setMessage({ type: 'success', text: 'PDF downloaded successfully!' })
    } catch (error) {
      console.error('PDF generation error:', error)
      setMessage({
        type: 'error',
        text: 'Failed to generate PDF. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!receipt.clientEmail) {
      setMessage({ type: 'error', text: 'Client email is required' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // This will call the API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Email sent successfully to ${receipt.clientEmail}!`,
        })
      } else {
        throw new Error(data.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Email sending error:', error)
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to send email. Please check your email configuration.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReceipt = () => {
    try {
      // Get existing receipts from localStorage
      const existingReceipts = JSON.parse(
        localStorage.getItem('codify-receipts') || '[]'
      )

      // Check if receipt already exists
      const existingIndex = existingReceipts.findIndex(
        (r: Receipt) => r.id === receipt.id
      )

      if (existingIndex >= 0) {
        // Update existing receipt
        existingReceipts[existingIndex] = receipt
        setMessage({ type: 'success', text: 'Receipt updated successfully!' })
      } else {
        // Add new receipt
        existingReceipts.push(receipt)
        setMessage({ type: 'success', text: 'Receipt saved successfully!' })
      }

      // Save to localStorage
      localStorage.setItem('codify-receipts', JSON.stringify(existingReceipts))

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: 'Failed to save receipt' })
    }
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6 no-print">
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="px-6 py-3 bg-primary-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Receipt
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={isLoading}
          className="px-6 py-3 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>

        <button
          onClick={handleSendEmail}
          disabled={isLoading || !receipt.clientEmail}
          className="px-6 py-3 bg-primary-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Send Email
        </button>

        <button
          onClick={handleSaveReceipt}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-200 text-primary-black rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Receipt
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-black"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}
    </>
  )
}

