'use client'

/**
 * Receipts Listing Page
 * Displays all saved receipts with options to view, edit, or delete
 */

import { useState, useEffect } from 'react'
import { Receipt } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Partial' | 'Paid'>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load receipts from localStorage
    try {
      const savedReceipts = JSON.parse(
        localStorage.getItem('codify-receipts') || '[]'
      )
      setReceipts(savedReceipts)
      setFilteredReceipts(savedReceipts)
    } catch (error) {
      console.error('Error loading receipts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Filter receipts based on search query and status filter
    let filtered = receipts

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(
        (receipt) => receipt.paymentStatus === statusFilter
      )
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (receipt) =>
          receipt.clientName.toLowerCase().includes(query) ||
          receipt.receiptNumber.toLowerCase().includes(query) ||
          receipt.projectTitle.toLowerCase().includes(query)
      )
    }

    setFilteredReceipts(filtered)
  }, [searchQuery, statusFilter, receipts])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      const updatedReceipts = receipts.filter((r) => r.id !== id)
      setReceipts(updatedReceipts)
      localStorage.setItem('codify-receipts', JSON.stringify(updatedReceipts))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-black"></div>
          <p className="mt-4 text-gray-600">Loading receipts...</p>
        </div>
      </div>
    )
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
                className="px-3 py-2 md:px-4 md:py-2 border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Create Receipt
              </Link>
              <Link
                href="/receipts"
                className="px-3 py-2 md:px-4 md:py-2 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm md:text-base whitespace-nowrap"
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
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-black">
            Saved Receipts
          </h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                statusFilter === 'All'
                  ? 'bg-primary-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({receipts.length})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                statusFilter === 'Pending'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Pending ({receipts.filter((r) => r.paymentStatus === 'Pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('Partial')}
              className={`px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                statusFilter === 'Partial'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Partial ({receipts.filter((r) => r.paymentStatus === 'Partial').length})
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                statusFilter === 'Paid'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Paid ({receipts.filter((r) => r.paymentStatus === 'Paid').length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name or receipt number..."
              className="w-full px-4 py-2 md:py-3 pl-10 md:pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow text-sm md:text-base"
            />
            <svg
              className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {(searchQuery || statusFilter !== 'All') && (
            <p className="mt-2 text-sm text-gray-600">
              Showing {filteredReceipts.length} receipt(s)
              {searchQuery && ` matching "${searchQuery}"`}
              {statusFilter !== 'All' && ` with status "${statusFilter}"`}
            </p>
          )}
        </div>

        {filteredReceipts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <svg
              className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No Receipts Found' : 'No Receipts Found'}
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-6 break-words">
              {searchQuery
                ? `No receipts match "${searchQuery}". Try a different search.`
                : 'Start by creating your first receipt'}
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 md:px-6 md:py-3 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm md:text-base"
            >
              Create Receipt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-primary-black break-words">
                      {receipt.projectTitle || 'Untitled Project'}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 break-words">
                      #{receipt.receiptNumber}
                    </p>
                  </div>
                  <span
                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(
                      receipt.paymentStatus
                    )}`}
                  >
                    {receipt.paymentStatus}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs md:text-sm text-gray-600 break-words">
                    <span className="font-semibold">Client:</span>{' '}
                    {receipt.clientName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <span className="font-semibold">Date:</span>{' '}
                    {formatDate(receipt.issueDate)}
                  </p>
                  <div>
                    <p className="text-base md:text-lg font-bold text-primary-black break-words">
                      Total: {formatCurrency(receipt.grandTotal)}
                    </p>
                    {receipt.paidAmount !== undefined && receipt.paidAmount > 0 && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                        Paid: {formatCurrency(receipt.paidAmount)}
                        {receipt.paymentStatus === 'Partial' && (
                          <span className="text-red-600 ml-2">
                            (Remaining: {formatCurrency(receipt.grandTotal - receipt.paidAmount)})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/receipts/${receipt.id}`}
                    className="flex-1 min-w-[80px] px-3 py-2 md:px-4 bg-primary-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center text-xs md:text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard?edit=${receipt.id}`}
                    className="flex-1 min-w-[80px] px-3 py-2 md:px-4 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-center text-xs md:text-sm"
                  >
                    Edit
                  </Link>
                  {receipt.paymentStatus === 'Pending' ? (
                    <button
                      onClick={() => handleDelete(receipt.id)}
                      className="flex-1 min-w-[80px] px-3 py-2 md:px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      disabled
                      title="Cannot delete receipts with Partial or Paid status"
                      className="flex-1 min-w-[80px] px-3 py-2 md:px-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

