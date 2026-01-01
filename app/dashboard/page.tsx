'use client'

/**
 * Dashboard Page
 * Main page for creating and previewing receipts
 */

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Receipt } from '@/lib/types'
import ReceiptForm from '@/components/ReceiptForm'
import ReceiptPreview from '@/components/ReceiptPreview'
import ReceiptActions from '@/components/ReceiptActions'
import LogoutButton from '@/components/LogoutButton'
import { generateReceiptNumber } from '@/lib/utils'

function DashboardContent() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [receipt, setReceipt] = useState<Receipt>({
    id: `receipt-${Date.now()}`,
    receiptNumber: generateReceiptNumber(),
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'Pending',
    items: [
      {
        id: '1',
        description: '',
      },
    ],
    subtotal: 0,
    discount: 0,
    tax: 0,
    grandTotal: 0,
    notes: '',
    createdAt: new Date().toISOString(),
  })

  const [initialReceipt, setInitialReceipt] = useState<Receipt | null>(null)

  // Load receipt for editing if editId is provided
  useEffect(() => {
    if (editId) {
      try {
        const savedReceipts = JSON.parse(
          localStorage.getItem('codify-receipts') || '[]'
        )
        const foundReceipt = savedReceipts.find(
          (r: Receipt) => r.id === editId
        )
        if (foundReceipt) {
          setInitialReceipt(foundReceipt)
          setReceipt(foundReceipt)
        }
      } catch (error) {
        console.error('Error loading receipt for editing:', error)
      }
    }
  }, [editId])

  const handleReceiptChange = (updatedReceipt: Receipt) => {
    setReceipt(updatedReceipt)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg md:text-xl font-bold text-primary-black">C</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Codify</h1>
                <p className="text-xs md:text-sm text-gray-300 italic">
                  Where Code Meets Quality
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 md:gap-4 items-center w-full md:w-auto">
              <Link
                href="/dashboard"
                className="px-3 py-2 md:px-4 md:py-2 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Create Receipt
              </Link>
              <Link
                href="/receipts"
                className="px-3 py-2 md:px-4 md:py-2 border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                View Receipts
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Form */}
          <div className="lg:sticky lg:top-8 lg:h-fit order-2 lg:order-1">
            <ReceiptForm
              onReceiptChange={handleReceiptChange}
              initialReceipt={initialReceipt}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary-black">
                Receipt Preview
              </h2>

              {/* Actions */}
              <ReceiptActions receipt={receipt} />

              {/* Preview */}
              <div className="mt-6">
                <ReceiptPreview receipt={receipt} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-black text-white mt-8 md:mt-12 py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-gray-400">
            © {new Date().getFullYear()} Codify - Where Code Meets Quality
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

