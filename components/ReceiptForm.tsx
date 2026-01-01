'use client'

/**
 * ReceiptForm Component
 * Handles receipt/invoice data input with validation
 */

import { useState, useEffect } from 'react'
import { Receipt, ReceiptItem, PaymentStatus } from '@/lib/types'
import { generateReceiptNumber, formatCurrency } from '@/lib/utils'

interface ReceiptFormProps {
  onReceiptChange: (receipt: Receipt) => void
  initialReceipt?: Receipt | null
}

export default function ReceiptForm({
  onReceiptChange,
  initialReceipt,
}: ReceiptFormProps) {
  const [formData, setFormData] = useState<Partial<Receipt>>({
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    receiptNumber: generateReceiptNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'Pending' as PaymentStatus,
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
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with existing receipt if provided
  useEffect(() => {
    if (initialReceipt) {
      setFormData(initialReceipt)
    }
  }, [initialReceipt])

  // Calculate totals whenever subtotal, discount, or tax change
  useEffect(() => {
    const subtotal = formData.subtotal || 0
    const discount = formData.discount || 0
    const tax = formData.tax || 0
    const grandTotal = subtotal - discount + tax

    setFormData((prev) => ({
      ...prev,
      grandTotal,
    }))
  }, [formData.subtotal, formData.discount, formData.tax])

  // Notify parent component of changes
  useEffect(() => {
    if (formData.receiptNumber) {
      const receipt: Receipt = {
        id: initialReceipt?.id || `receipt-${Date.now()}`,
        receiptNumber: formData.receiptNumber,
        clientName: formData.clientName || '',
        clientEmail: formData.clientEmail || '',
        projectTitle: formData.projectTitle || '',
        issueDate: formData.issueDate || new Date().toISOString(),
        paymentStatus: formData.paymentStatus || 'Pending',
        items: formData.items || [],
        subtotal: formData.subtotal || 0,
        discount: formData.discount || 0,
        tax: formData.tax || 0,
        grandTotal: formData.grandTotal || 0,
        notes: formData.notes || '',
        createdAt: initialReceipt?.createdAt || new Date().toISOString(),
      }
      onReceiptChange(receipt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleItemChange = (id: string, value: string) => {
    setFormData((prev) => {
      const items = prev.items?.map((item) => {
        if (item.id === id) {
          return { ...item, description: value }
        }
        return item
      })
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: `item-${Date.now()}`,
          description: '',
        },
      ],
    }))
  }

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((item) => item.id !== id) || [],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientName?.trim()) {
      newErrors.clientName = 'Client name is required'
    }

    if (!formData.clientEmail?.trim()) {
      newErrors.clientEmail = 'Client email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format'
    }

    if (!formData.projectTitle?.trim()) {
      newErrors.projectTitle = 'Project title is required'
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'At least one item is required'
    } else {
      formData.items.forEach((item, index) => {
        if (!item.description.trim()) {
          newErrors[`item-${index}-description`] = 'Item description is required'
        }
      })
    }

    if (!formData.subtotal || formData.subtotal <= 0) {
      newErrors.subtotal = 'Subtotal must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    // Remove leading zeros and parse the value
    let inputValue = e.target.value
    
    // Remove leading zeros (except for decimal numbers like 0.5)
    if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
      inputValue = inputValue.replace(/^0+/, '') || '0'
    }
    
    const value = parseFloat(inputValue) || 0
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleNumericFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    field: string
  ) => {
    // Clear the field if value is 0
    const currentValue = formData[field as keyof typeof formData] as number
    if (currentValue === 0) {
      setFormData((prev) => ({ ...prev, [field]: '' as any }))
      e.target.value = ''
    }
  }

  const handleNumericBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    field: string
  ) => {
    // Set to 0 if empty
    if (e.target.value === '' || e.target.value === '0') {
      setFormData((prev) => ({ ...prev, [field]: 0 }))
      e.target.value = '0'
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary-black">
        Create Receipt / Invoice
      </h2>

      <div className="space-y-6">
        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-black border-b border-gray-200 pb-2">
            Client Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow ${
                errors.clientEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="client@example.com"
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>
            )}
          </div>
        </div>

        {/* Project Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-black border-b border-gray-200 pb-2">
            Project Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow ${
                errors.projectTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter project title"
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.projectTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt Number
              </label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus || 'Pending'}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-black border-b border-gray-200 pb-2">
              Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-primary-yellow text-primary-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {formData.items?.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, e.target.value)
                      }
                      rows={3}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow resize-y break-words overflow-wrap-anywhere ${
                        errors[`item-${index}-description`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter item description (supports long descriptions and long words)"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    />
                    {errors[`item-${index}-description`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`item-${index}-description`]}
                      </p>
                    )}
                  </div>

                  <div>
                    {formData.items && formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtotal (LKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.subtotal === 0 ? '' : formData.subtotal || ''}
              onChange={(e) => handleNumericChange(e, 'subtotal')}
              onFocus={(e) => handleNumericFocus(e, 'subtotal')}
              onBlur={(e) => handleNumericBlur(e, 'subtotal')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow ${
                errors.subtotal ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.subtotal && (
              <p className="text-red-500 text-xs mt-1">{errors.subtotal}</p>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-black border-b border-gray-200 pb-2">
            Totals
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">
                {formatCurrency(formData.subtotal || 0)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discount === 0 ? '' : formData.discount || ''}
                onChange={(e) => handleNumericChange(e, 'discount')}
                onFocus={(e) => handleNumericFocus(e, 'discount')}
                onBlur={(e) => handleNumericBlur(e, 'discount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax === 0 ? '' : formData.tax || ''}
                onChange={(e) => handleNumericChange(e, 'tax')}
                onFocus={(e) => handleNumericFocus(e, 'tax')}
                onBlur={(e) => handleNumericBlur(e, 'tax')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-between pt-2 border-t-2 border-primary-black">
              <span className="text-lg font-bold text-primary-black">
                Grand Total:
              </span>
              <span className="text-lg font-bold text-primary-black">
                {formatCurrency(formData.grandTotal || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Terms & Conditions
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            placeholder="Enter any additional notes or terms..."
          />
        </div>
      </div>
    </div>
  )
}

