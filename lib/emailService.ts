/**
 * Email Service utility using Nodemailer
 * Handles sending receipts via Gmail SMTP
 * 
 * Note: Configure your Gmail SMTP credentials in environment variables:
 * - EMAIL_HOST=smtp.gmail.com
 * - EMAIL_PORT=587
 * - EMAIL_USER=your-email@gmail.com
 * - EMAIL_PASS=your-app-password
 */

import nodemailer from 'nodemailer'
import { Receipt } from './types'
import { formatCurrency, formatDate } from './utils'

// Email transporter configuration
let transporter: nodemailer.Transporter | null = null

/**
 * Initialize email transporter with Gmail SMTP
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password
    },
  })

  return transporter
}

/**
 * Generate HTML email template for receipt
 */
function generateReceiptEmailHTML(receipt: Receipt): string {
  const itemsHTML = receipt.items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <span style="color: #FFD700; font-weight: bold; margin-right: 8px;">${index + 1}.</span>
        <span style="color: #1f2937; line-height: 1.6; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word;">${item.description}</span>
      </td>
    </tr>
  `
    )
    .join('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'background-color: #d1fae5; color: #065f46;'
      case 'Partial':
        return 'background-color: #fef3c7; color: #92400e;'
      case 'Pending':
        return 'background-color: #fee2e2; color: #991b1b;'
      default:
        return 'background-color: #f3f4f6; color: #374151;'
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            color: #FFD700;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            font-style: italic;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .receipt-number {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #FFD700;
          }
          .receipt-number h2 {
            margin: 0 0 5px 0;
            font-size: 24px;
            color: #000000;
            font-weight: 700;
          }
          .info-grid {
            display: table;
            width: 100%;
            margin: 25px 0;
          }
          .info-box {
            display: table-cell;
            width: 48%;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
            vertical-align: top;
            border: 1px solid #e5e7eb;
          }
          .info-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .info-value {
            font-size: 16px;
            color: #000000;
            font-weight: 600;
            margin: 0;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            ${getStatusColor(receipt.paymentStatus)}
          }
          .items-section {
            margin: 30px 0;
          }
          .items-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .totals-section {
            background-color: #f9fafb;
            padding: 25px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            margin: 30px 0;
          }
          .total-row {
            display: table;
            width: 100%;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .total-row:last-child {
            border-bottom: none;
          }
          .total-label {
            display: table-cell;
            width: 50%;
            color: #374151;
            font-weight: 500;
          }
          .total-value {
            display: table-cell;
            width: 50%;
            text-align: right;
            color: #000000;
            font-weight: 600;
            font-size: 18px;
          }
          .grand-total {
            border-top: 4px solid #000000 !important;
            padding-top: 20px !important;
            margin-top: 15px !important;
          }
          .grand-total .total-label {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .grand-total .total-value {
            font-size: 24px;
            font-weight: 700;
          }
          .notes-section {
            background-color: #fffbeb;
            padding: 20px;
            border-left: 4px solid #FFD700;
            border-radius: 4px;
            margin: 30px 0;
          }
          .notes-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #374151;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .notes-content {
            color: #1f2937;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e5e7eb;
          }
          .footer p {
            margin: 8px 0;
            color: #6b7280;
          }
          .footer .thank-you {
            font-size: 18px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 5px;
          }
          .footer .company-name {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <h1>Codify</h1>
            <p>Where Code Meets Quality</p>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Receipt Number -->
            <div class="receipt-number">
              <h2>Receipt #${receipt.receiptNumber}</h2>
            </div>

            <!-- Project Info -->
            <div style="background-color: #fffbeb; padding: 20px; border-left: 4px solid #FFD700; border-radius: 4px; margin-bottom: 25px;">
              <div class="info-label">PROJECT:</div>
              <div style="font-size: 20px; font-weight: 700; color: #000000; margin-top: 5px;">
                ${receipt.projectTitle}
              </div>
            </div>

            <!-- Client & Date Info -->
            <div class="info-grid">
              <div class="info-box" style="margin-right: 2%;">
                <div class="info-label">BILL TO:</div>
                <p class="info-value" style="margin: 5px 0;">${receipt.clientName}</p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">${receipt.clientEmail}</p>
              </div>
              <div class="info-box" style="margin-left: 2%;">
                <div class="info-label">ISSUE DATE:</div>
                <p class="info-value" style="margin: 5px 0;">${formatDate(receipt.issueDate)}</p>
                <div style="margin-top: 12px;">
                  <div class="info-label" style="margin-bottom: 5px;">PAYMENT STATUS:</div>
                  <span class="status-badge">${receipt.paymentStatus}</span>
                </div>
              </div>
            </div>

            <!-- Items -->
            <div class="items-section">
              <div class="items-title">ITEMS:</div>
              <table class="items-table">
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${formatCurrency(receipt.subtotal)}</span>
              </div>
              ${receipt.discount > 0 ? `
              <div class="total-row">
                <span class="total-label">Discount:</span>
                <span class="total-value" style="color: #dc2626;">-${formatCurrency(receipt.discount)}</span>
              </div>
              ` : ''}
              ${receipt.tax > 0 ? `
              <div class="total-row">
                <span class="total-label">Tax:</span>
                <span class="total-value">${formatCurrency(receipt.tax)}</span>
              </div>
              ` : ''}
              <div class="total-row grand-total">
                <span class="total-label">Grand Total:</span>
                <span class="total-value">${formatCurrency(receipt.grandTotal)}</span>
              </div>
              ${receipt.paidAmount !== undefined && receipt.paidAmount > 0 ? `
              <div class="total-row" style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 10px;">
                <span class="total-label" style="color: #059669; font-weight: 600;">Paid Amount:</span>
                <span class="total-value" style="color: #059669; font-weight: 600;">${formatCurrency(receipt.paidAmount)}</span>
              </div>
              ${receipt.paymentStatus === 'Partial' ? `
              <div class="total-row">
                <span class="total-label" style="color: #dc2626; font-weight: 600;">Remaining Balance:</span>
                <span class="total-value" style="color: #dc2626; font-weight: 600;">${formatCurrency(receipt.grandTotal - receipt.paidAmount)}</span>
              </div>
              ` : ''}
              ${receipt.paymentStatus === 'Paid' && receipt.paidDate ? `
              <div class="total-row">
                <span class="total-label">Paid Date:</span>
                <span class="total-value">${formatDate(receipt.paidDate)}</span>
              </div>
              ` : ''}
              ` : ''}
            </div>

          ${receipt.payments && receipt.payments.length > 0 ? `
          <div style="margin: 30px 0;">
            <div class="items-title">PAYMENT HISTORY:</div>
            <table class="items-table">
              <tbody>
                ${receipt.payments.map((payment, index) => `
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                      <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                          <span style="background-color: #FFD700; color: #000; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">Payment #${index + 1}</span>
                          <span style="color: #6b7280; font-size: 14px;">${formatDate(payment.paymentDate)}</span>
                        </div>
                        ${payment.notes ? `<p style="color: #6b7280; font-size: 14px; margin-top: 4px;">${payment.notes}</p>` : ''}
                      </div>
                      <span style="font-size: 18px; font-weight: bold; color: #000;">${formatCurrency(payment.amount)}</span>
                    </div>
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

            <!-- Notes -->
            ${receipt.notes ? `
            <div class="notes-section">
              <div class="notes-title">NOTES:</div>
              <div class="notes-content">${receipt.notes}</div>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="thank-you">Thank you for your business!</p>
            <p class="company-name">Codify - Where Code Meets Quality</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send receipt via email
 * @param receipt - Receipt data to send
 * @param recipientEmail - Optional recipient email (defaults to client email)
 */
export async function sendReceiptEmail(
  receipt: Receipt,
  recipientEmail?: string
): Promise<void> {
  try {
    const emailTransporter = getTransporter()

    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        'Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.'
      )
    }

    const mailOptions = {
      from: `"Codify" <${process.env.EMAIL_USER}>`,
      to: recipientEmail || receipt.clientEmail,
      subject: `Receipt #${receipt.receiptNumber} - ${receipt.projectTitle}`,
      html: generateReceiptEmailHTML(receipt),
      text: `Receipt #${receipt.receiptNumber}\n\nProject: ${receipt.projectTitle}\nTotal: ${formatCurrency(receipt.grandTotal)}\n\nThank you for your business!`,
    }

    const info = await emailTransporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email. Please check your email configuration.')
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const emailTransporter = getTransporter()
    await emailTransporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}

