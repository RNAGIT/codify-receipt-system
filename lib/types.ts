/**
 * Type definitions for Receipt/Invoice data structure
 */

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending'

export interface ReceiptItem {
  id: string
  description: string
}

export interface PaymentTransaction {
  id: string
  amount: number
  paymentDate: string
  notes?: string
}

export interface Receipt {
  id: string
  receiptNumber: string
  clientName: string
  clientEmail: string
  projectTitle: string
  issueDate: string
  paymentStatus: PaymentStatus
  items: ReceiptItem[]
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  notes: string
  createdAt: string
  payments?: PaymentTransaction[]
  paidAmount?: number
  paidDate?: string
}

