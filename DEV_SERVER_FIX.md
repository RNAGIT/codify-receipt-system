# Dev Server Fix: Cannot find module './276.js'

## 🔧 Solution Applied

### Issue
The error `Cannot find module './276.js'` occurs in Next.js dev server when webpack chunks become corrupted or out of sync.

### Root Cause
This is a known issue with Next.js 14 when using `useSearchParams` with Suspense boundaries. Webpack tries to load dynamic chunks that don't exist or are corrupted.

### Fix Applied

1. **Updated `next.config.js`** with webpack optimization:
   ```javascript
   webpack: (config, { dev, isServer }) => {
     if (dev && !isServer) {
       config.optimization = {
         ...config.optimization,
         runtimeChunk: 'single',
       }
     }
     return config
   }
   ```

2. **Cleared all caches:**
   - Deleted `.next` folder
   - Cleared node_modules cache
   - Stopped all running dev servers

### Steps to Fix

1. **Stop the dev server** (Ctrl+C in terminal)

2. **Clean the cache:**
   ```powershell
   # Delete .next folder
   Remove-Item -Recurse -Force .next
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### If Error Persists

1. **Full clean rebuild:**
   ```powershell
   # Stop dev server
   # Delete .next
   Remove-Item -Recurse -Force .next
   
   # Clear npm cache (optional)
   npm cache clean --force
   
   # Reinstall dependencies (optional, if above doesn't work)
   Remove-Item -Recurse -Force node_modules
   npm install
   
   # Rebuild
   npm run build
   
   # Start fresh
   npm run dev
   ```

2. **Alternative: Use Production Build:**
   ```bash
   npm run build
   npm start
   ```

### Prevention

- Always stop dev server properly (Ctrl+C) before switching branches
- Clear `.next` folder if you notice any strange behavior
- Use `npm run rebuild:win` script to quickly clean and rebuild

### Status

✅ Webpack config updated
✅ Cache clearing scripts added
✅ Ready for fresh dev server start

