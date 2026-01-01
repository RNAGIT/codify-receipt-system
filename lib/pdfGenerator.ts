/**
 * PDF Generation utility using html2pdf.js
 * Generates professional PDF receipts from HTML content
 * Note: This module should only be used on the client side
 */

// Dynamic import for html2pdf.js (CommonJS module)
let html2pdf: any = null

async function getHtml2Pdf() {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available on the client side')
  }
  
  if (!html2pdf) {
    html2pdf = (await import('html2pdf.js')).default
  }
  
  return html2pdf
}

interface PDFOptions {
  filename?: string
  margin?: number
  format?: string
  orientation?: 'portrait' | 'landscape'
}

/**
 * Generate PDF from HTML element
 * @param element - HTML element to convert to PDF
 * @param options - PDF generation options
 */
export async function generatePDF(
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> {
  const {
    filename = `receipt-${Date.now()}.pdf`,
    margin = 10,
    format = 'a4',
    orientation = 'portrait',
  } = options

  const opt = {
    margin: margin,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: format, orientation: orientation },
  }

  try {
    const html2pdfLib = await getHtml2Pdf()
    await html2pdfLib().set(opt).from(element).save()
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Download PDF from HTML element
 * @param element - HTML element to convert to PDF
 * @param filename - Name of the PDF file
 */
export async function downloadPDF(
  element: HTMLElement,
  filename: string = `receipt-${Date.now()}.pdf`
): Promise<void> {
  await generatePDF(element, { filename })
}

