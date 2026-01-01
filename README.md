# Codify - Receipt & Invoice Management System

A professional receipt and invoice management web application built with Next.js (App Router), React, and Tailwind CSS for **Codify** - *Where Code Meets Quality*.

## 🚀 Features

- ✅ **Create Professional Receipts/Invoices**
  - Client information management
  - Project details tracking
  - Auto-generated receipt numbers
  - Multiple payment status options (Paid, Partial, Pending)
  - Dynamic item list with quantity and pricing
  - Automatic calculation of subtotals, discounts, taxes, and grand totals
  - Custom notes and terms & conditions

- ✅ **Print-Ready Receipts**
  - Clean A4 layout
  - Print-optimized CSS
  - Professional company branding
  - Minimal borders and proper spacing

- ✅ **PDF Download**
  - Generate PDF files from receipts
  - High-quality output using html2pdf.js
  - Professional formatting preserved

- ✅ **Email Integration**
  - Send receipts via Gmail SMTP
  - Beautiful HTML email templates
  - Nodemailer compatible
  - Ready for production use

- ✅ **Receipt Management**
  - Save receipts to local storage
  - View all saved receipts
  - Edit existing receipts
  - Delete receipts
  - Individual receipt viewing

- ✅ **Modern UI/UX**
  - Professional agency-level design
  - Black, white, and yellow color scheme
  - Responsive layout
  - Clean typography (Inter, Poppins, Roboto)
  - Dashboard-style form with live preview

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **PDF Generation**: html2pdf.js
- **Email Service**: Nodemailer
- **Language**: TypeScript
- **Fonts**: Inter, Poppins, Roboto

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReceiptPrint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Email Configuration (Optional)

To enable email functionality, create a `.env.local` file in the root directory:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you'll need to:
1. Enable 2-Factor Authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_PASS`

## 📁 Project Structure

```
ReceiptPrint/
├── app/
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts          # Email API endpoint
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard (create/edit receipts)
│   ├── receipts/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Individual receipt view
│   │   └── page.tsx              # Receipts listing page
│   ├── globals.css               # Global styles and print CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to dashboard)
├── components/
│   ├── ReceiptForm.tsx           # Receipt input form
│   ├── ReceiptPreview.tsx        # Print-ready receipt preview
│   └── ReceiptActions.tsx        # Print, PDF, Email actions
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── utils.ts                  # Utility functions
│   ├── pdfGenerator.ts           # PDF generation utility
│   └── emailService.ts           # Email service utility
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Black**: `#000000`
- **Primary White**: `#FFFFFF`
- **Primary Yellow**: `#FFD700` (Gold)

### Typography
- **Primary Font**: Inter
- **Secondary Fonts**: Poppins, Roboto
- **Fallback**: System UI, Sans-serif

## 📝 Usage

### Creating a Receipt

1. Navigate to the Dashboard (`/dashboard`)
2. Fill in client information (name and email)
3. Enter project details (title, date, payment status)
4. Add items with descriptions, quantities, and unit prices
5. Optionally add discount and tax
6. Add notes or terms & conditions
7. Preview the receipt in real-time on the right side
8. Use action buttons to:
   - **Print**: Print the receipt directly
   - **Download PDF**: Save as PDF file
   - **Send Email**: Email to client (requires email configuration)
   - **Save Receipt**: Save to local storage

### Managing Receipts

1. Navigate to Receipts (`/receipts`) to view all saved receipts
2. Click **View** to see full receipt details
3. Click **Edit** to modify an existing receipt
4. Click **Delete** to remove a receipt

## 🖨️ Print Features

The receipt is optimized for printing:
- A4 page size
- Clean white background
- Minimal borders
- Professional spacing
- Company branding
- Print-specific CSS media queries

## 📧 Email Features

The email service includes:
- Professional HTML email template
- Receipt details in formatted table
- Company branding
- Responsive email design
- Plain text fallback

## 🔒 Data Storage

Currently, receipts are stored in browser's `localStorage`. This is suitable for:
- Development and testing
- Single-user scenarios
- Quick prototyping

For production use with multiple users, consider integrating:
- Database (PostgreSQL, MongoDB, etc.)
- Authentication system
- Cloud storage for PDFs
- Email service provider (SendGrid, Mailgun, etc.)

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to Vercel** (Recommended for Next.js)
   - Connect your repository to Vercel
   - Add environment variables for email configuration
   - Deploy automatically on push

## 🧪 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Cloud storage for PDFs
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] Invoice templates
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Client management system

## 📄 License

This project is proprietary software for Codify.

## 👥 Support

For issues, questions, or contributions, please contact the development team.

---

**Codify** - Where Code Meets Quality

