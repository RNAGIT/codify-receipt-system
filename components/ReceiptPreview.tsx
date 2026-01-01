'use client'

/**
 * ReceiptPreview Component
 * Displays a print-ready receipt preview with professional styling
 */

import { Receipt } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ReceiptPreviewProps {
  receipt: Receipt
}

export default function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
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

  return (
    <div
      id="receipt-preview"
      className="receipt-preview print-container w-full max-w-4xl mx-auto bg-white p-6 md:p-8 shadow-xl"
    >
      {/* Company Header with Bill To */}
      <div className="mb-4 pb-4 border-b-2 border-primary-black">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary-yellow rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-black">C</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-black tracking-tight">
                Codify
              </h1>
              <p className="text-xs text-gray-600 italic">
                Where Code Meets Quality
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Receipt / Invoice
            </p>
            <p className="text-xl font-bold text-primary-black">
              #{receipt.receiptNumber}
            </p>
          </div>
        </div>

        {/* Bill To and Project in Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
              BILL TO:
            </h3>
            <p className="text-sm font-bold text-primary-black mb-0.5">
              {receipt.clientName}
            </p>
            <p className="text-xs text-gray-600">{receipt.clientEmail}</p>
          </div>

          <div className="bg-primary-yellow bg-opacity-10 p-3 rounded border-l-2 border-primary-yellow">
            <h3 className="text-xs uppercase tracking-wider text-gray-600 font-bold mb-1">
              PROJECT:
            </h3>
            <p className="text-sm font-bold text-primary-black">
              {receipt.projectTitle}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
              Issue Date:
            </p>
            <p className="text-sm font-semibold text-primary-black mb-2">
              {formatDate(receipt.issueDate)}
            </p>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
              Status:
            </p>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(
                receipt.paymentStatus
              )}`}
            >
              {receipt.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wider text-gray-600 font-bold mb-2">
          ITEMS:
        </h3>
        <div className="border border-gray-300 rounded overflow-hidden">
          {receipt.items.map((item, index) => (
            <div
              key={item.id || index}
              className={`py-2 px-4 border-b border-gray-200 last:border-b-0 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-primary-yellow font-bold text-xs mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words overflow-wrap-anywhere leading-snug flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-4">
        <div className="flex justify-end">
          <div className="w-full md:w-80 bg-gray-50 p-4 rounded border border-gray-300">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-700 font-medium">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(receipt.subtotal)}
                </span>
              </div>

              {receipt.discount > 0 && (
                <div className="flex justify-between items-center py-1 border-t border-gray-300">
                  <span className="text-sm text-gray-700 font-medium">Discount:</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(receipt.discount)}
                  </span>
                </div>
              )}

              {receipt.tax > 0 && (
                <div className="flex justify-between items-center py-1 border-t border-gray-300">
                  <span className="text-sm text-gray-700 font-medium">Tax:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(receipt.tax)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-primary-black">
                <span className="text-lg font-bold text-primary-black uppercase">
                  Grand Total:
                </span>
                <span className="text-lg font-bold text-primary-black">
                  {formatCurrency(receipt.grandTotal)}
                </span>
              </div>

              {/* Payment Information */}
              {receipt.paidAmount !== undefined && receipt.paidAmount > 0 && (
                <>
                  <div className="flex justify-between items-center py-1 pt-2 mt-2 border-t border-gray-300">
                    <span className="text-sm text-gray-700 font-medium">Paid:</span>
                    <span className="font-semibold text-green-700">
                      {formatCurrency(receipt.paidAmount)}
                    </span>
                  </div>
                  {receipt.paymentStatus === 'Partial' && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-700 font-medium">Balance:</span>
                      <span className="font-semibold text-red-700">
                        {formatCurrency(receipt.grandTotal - receipt.paidAmount)}
                      </span>
                    </div>
                  )}
                  {receipt.paymentStatus === 'Paid' && receipt.paidDate && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-700 font-medium">Paid Date:</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {formatDate(receipt.paidDate)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {receipt.payments && receipt.payments.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-600 font-bold mb-2">
            PAYMENT HISTORY:
          </h3>
          <div className="border border-gray-300 rounded overflow-hidden">
            {receipt.payments.map((payment, index) => (
              <div
                key={payment.id}
                className={`py-2 px-4 border-b border-gray-200 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary-yellow text-primary-black px-2 py-0.5 rounded text-xs font-bold">
                        #{index + 1}
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatDate(payment.paymentDate)}
                      </span>
                    </div>
                    {payment.notes && (
                      <p className="text-xs text-gray-600">{payment.notes}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary-black">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {receipt.notes && (
        <div className="mb-4 p-3 bg-primary-yellow bg-opacity-5 border-l-2 border-primary-yellow rounded-r">
          <h3 className="text-xs uppercase tracking-wider text-gray-700 font-bold mb-1">
            NOTES:
          </h3>
          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-snug">
            {receipt.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-300">
        <div className="text-center">
          <p className="text-sm font-bold text-primary-black mb-1">
            Thank you for your business!
          </p>
          <p className="text-xs text-gray-600">
            Codify - Where Code Meets Quality
          </p>
        </div>
      </div>
    </div>
  )
}

