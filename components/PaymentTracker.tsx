'use client'

/**
 * PaymentTracker Component
 * Handles payment tracking and status updates
 */

import { useState } from 'react'
import { Receipt, PaymentTransaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PaymentTrackerProps {
  receipt: Receipt
  onPaymentUpdate: (updatedReceipt: Receipt) => void
}

export default function PaymentTracker({
  receipt,
  onPaymentUpdate,
}: PaymentTrackerProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [paymentNotes, setPaymentNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const payments = receipt.payments || []
  const paidAmount = receipt.paidAmount || 0
  const remainingAmount = receipt.grandTotal - paidAmount

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid payment amount')
      return
    }

    if (amount > remainingAmount) {
      alert(`Payment amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`)
      return
    }

    setIsSubmitting(true)

    const newPayment: PaymentTransaction = {
      id: `payment-${Date.now()}`,
      amount: amount,
      paymentDate: paymentDate,
      notes: paymentNotes,
    }

    const updatedPayments = [...payments, newPayment]
    const newPaidAmount = paidAmount + amount
    let newStatus: 'Paid' | 'Partial' | 'Pending' = 'Pending'

    if (newPaidAmount >= receipt.grandTotal) {
      newStatus = 'Paid'
    } else if (newPaidAmount > 0) {
      newStatus = 'Partial'
    }

    const updatedReceipt: Receipt = {
      ...receipt,
      payments: updatedPayments,
      paidAmount: newPaidAmount,
      paidDate: newPaidAmount >= receipt.grandTotal ? paymentDate : receipt.paidDate,
      paymentStatus: newStatus,
    }

    // Save to localStorage
    try {
      const savedReceipts = JSON.parse(
        localStorage.getItem('codify-receipts') || '[]'
      )
      const updatedReceipts = savedReceipts.map((r: Receipt) =>
        r.id === receipt.id ? updatedReceipt : r
      )
      localStorage.setItem('codify-receipts', JSON.stringify(updatedReceipts))
    } catch (error) {
      console.error('Error saving payment:', error)
    }

    onPaymentUpdate(updatedReceipt)
    setShowPaymentForm(false)
    setPaymentAmount('')
    setPaymentNotes('')
    setPaymentDate(new Date().toISOString().split('T')[0])
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary-black">
          Payment Tracking
        </h3>
        {receipt.paymentStatus !== 'Paid' && (
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="px-4 py-2 bg-primary-yellow text-primary-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            {showPaymentForm ? 'Cancel' : '+ Add Payment'}
          </button>
        )}
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Grand Total</p>
          <p className="text-2xl font-bold text-primary-black">
            {formatCurrency(receipt.grandTotal)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(paidAmount)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Remaining</p>
          <p className="text-2xl font-bold text-red-700">
            {formatCurrency(remainingAmount)}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      {showPaymentForm && receipt.paymentStatus !== 'Paid' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
          <h4 className="text-lg font-semibold text-primary-black mb-4">
            Add New Payment
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                max={remainingAmount}
                step="0.01"
                value={paymentAmount}
                onChange={(e) => {
                  let inputValue = e.target.value
                  // Remove leading zeros (except for decimal numbers like 0.5)
                  if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.replace(/^0+/, '') || '0'
                  }
                  setPaymentAmount(inputValue)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                placeholder={`Max: ${formatCurrency(remainingAmount)}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Remaining balance: {formatCurrency(remainingAmount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                placeholder="Payment method, reference number, etc."
              />
            </div>

            <button
              onClick={handleAddPayment}
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-primary-black mb-4">
            Payment History
          </h4>
          <div className="space-y-3">
            {payments.map((payment, index) => (
              <div
                key={payment.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-yellow text-primary-black px-3 py-1 rounded-full text-xs font-bold">
                      Payment #{index + 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDate(payment.paymentDate)}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-primary-black">
                    {formatCurrency(payment.amount)}
                  </p>
                  {payment.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      {payment.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Status */}
      {receipt.paymentStatus === 'Paid' && receipt.paidDate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-semibold mb-1">
            ✓ Fully Paid
          </p>
          <p className="text-sm text-green-600">
            Paid on: {formatDate(receipt.paidDate)}
          </p>
        </div>
      )}
    </div>
  )
}

