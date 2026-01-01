'use client'

/**
 * Individual Receipt View Page
 * Displays a single receipt with actions
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Receipt } from '@/lib/types'
import ReceiptPreview from '@/components/ReceiptPreview'
import ReceiptActions from '@/components/ReceiptActions'
import PaymentTracker from '@/components/PaymentTracker'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default function ReceiptViewPage() {
  const params = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReceipt = () => {
      try {
        const savedReceipts = JSON.parse(
          localStorage.getItem('codify-receipts') || '[]'
        )
        const foundReceipt = savedReceipts.find(
          (r: Receipt) => r.id === params.id
        )

        if (foundReceipt) {
          setReceipt(foundReceipt)
        } else {
          router.push('/receipts')
        }
      } catch (error) {
        console.error('Error loading receipt:', error)
        router.push('/receipts')
      } finally {
        setLoading(false)
      }
    }

    loadReceipt()
  }, [params.id, router])

  const handlePaymentUpdate = (updatedReceipt: Receipt) => {
    setReceipt(updatedReceipt)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-black">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Codify</h1>
                <p className="text-sm text-gray-300 italic">
                  Where Code Meets Quality
                </p>
              </div>
            </div>
            <nav className="flex gap-4 items-center">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Create Receipt
              </Link>
              <Link
                href="/receipts"
                className="px-4 py-2 border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                View Receipts
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/receipts"
            className="text-primary-black hover:text-gray-700 font-semibold flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Receipts
          </Link>
        </div>

        <div className="space-y-6">
          {/* Payment Tracker */}
          <PaymentTracker
            receipt={receipt}
            onPaymentUpdate={handlePaymentUpdate}
          />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-primary-black">
              Receipt #{receipt.receiptNumber}
            </h2>

            {/* Actions */}
            <ReceiptActions receipt={receipt} />

            {/* Preview */}
            <div className="mt-6">
              <ReceiptPreview receipt={receipt} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-black text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Codify - Where Code Meets Quality
          </p>
        </div>
      </footer>
    </div>
  )
}

