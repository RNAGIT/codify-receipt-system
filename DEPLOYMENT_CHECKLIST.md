# Deployment Checklist for Git & Vercel

## ✅ Pre-Deployment Checks

### 1. Environment Variables for Vercel

**Required Environment Variables in Vercel Dashboard:**

Go to Vercel Project Settings → Environment Variables and add:

```env
# Authentication (Required)
USERNAME_1=admin
PASSWORD_1=Codify@26
USERNAME_2=user
PASSWORD_2=user123

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Important:** 
- Do NOT commit `.env.local` to Git (already in .gitignore)
- Add these in Vercel Dashboard after deployment
- Restart deployment after adding environment variables

### 2. Git Configuration

**Files to verify are NOT committed:**
- ✅ `.env.local` (in .gitignore)
- ✅ `.env` (in .gitignore)
- ✅ `node_modules/` (in .gitignore)
- ✅ `.next/` (in .gitignore)

### 3. Build Configuration

**Verify these files exist:**
- ✅ `package.json` with build scripts
- ✅ `next.config.js`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`

### 4. Common Issues to Check

#### localStorage Usage
- ✅ All components using localStorage have `'use client'` directive
- ✅ All localStorage calls are wrapped in `typeof window !== 'undefined'` checks

#### API Routes
- ✅ All API routes are in `app/api/` directory
- ✅ Environment variables use `process.env.*` (not `NEXT_PUBLIC_*` for server-side)

#### Client Components
- ✅ All components using browser APIs have `'use client'` directive
- ✅ PDF generation only runs on client side

## 🚀 Deployment Steps

### Step 1: Git Push
```bash
git add .
git commit -m "Initial commit: Codify Receipt Management System"
git push origin main
```

### Step 2: Vercel Deployment
1. Connect your Git repository to Vercel
2. Vercel will auto-detect Next.js
3. Add environment variables in Vercel Dashboard
4. Deploy

### Step 3: Post-Deployment
1. Test login functionality
2. Verify email sending (if configured)
3. Test receipt creation and management

## ⚠️ Known Limitations

1. **localStorage**: Data is stored in browser, not persistent across devices
2. **Email**: Requires Gmail App Password configuration
3. **PDF**: Requires client-side JavaScript (works in browser)

## 🔧 Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Check for missing dependencies

### Runtime Errors
- Check browser console for errors
- Verify environment variables are set in Vercel
- Check API routes are accessible

### Authentication Issues
- Verify USERNAME_1, PASSWORD_1 are set in Vercel
- Check API route `/api/auth/login` is working

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS are set
- Check Gmail App Password is correct
- Verify SMTP settings

