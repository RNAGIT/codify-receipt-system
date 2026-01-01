# Setup Instructions for Login System

## Environment Variables Setup

To enable login functionality, you need to create a `.env.local` file in the root directory of your project.

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory (same level as `package.json`):

```
ReceiptPrint/
├── .env.local          ← Create this file
├── package.json
├── app/
└── ...
```

### Step 2: Add Credentials

Add your login credentials to `.env.local`:

```env
# Authentication Credentials
# You can configure up to 2 users

USERNAME_1=admin
PASSWORD_1=admin123

USERNAME_2=user
PASSWORD_2=user123
```

**Important Notes:**
- Replace `admin`, `admin123`, `user`, and `user123` with your desired credentials
- You can use only USERNAME_1 and PASSWORD_1 if you only need one user
- Make sure there are NO spaces around the `=` sign
- Do NOT use quotes around the values
- Do NOT commit `.env.local` to git (it's already in .gitignore)

### Step 3: Restart Development Server

**CRITICAL:** After creating or modifying `.env.local`, you MUST restart your development server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`

Environment variables are only loaded when the server starts, so changes won't take effect until you restart.

### Step 4: Test Login

1. Navigate to `http://localhost:3000`
2. You should see the login page
3. Enter one of the credentials you set in `.env.local`
4. Click "Sign In"

## Troubleshooting

### Error: 401 Unauthorized

If you get a 401 error:

1. **Check `.env.local` exists** in the root directory
2. **Check file format** - no spaces, no quotes:
   ```env
   USERNAME_1=admin    ✅ Correct
   USERNAME_1 = admin  ❌ Wrong (spaces)
   USERNAME_1="admin"  ❌ Wrong (quotes)
   ```
3. **Restart the server** after creating/modifying `.env.local`
4. **Check console logs** - the API route will log if credentials are loaded (in development mode)
5. **Verify credentials** - make sure username and password match exactly (case-sensitive)

### Error: "Authentication not configured"

This means no valid credentials were found in environment variables:
- Check that `.env.local` exists
- Check that USERNAME_1 and PASSWORD_1 are set
- Restart the server

### Still having issues?

1. Check the terminal/console for error messages
2. Verify `.env.local` is in the correct location (root directory)
3. Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
4. Try using simple credentials first (e.g., `admin` / `admin123`) to test

## Example `.env.local` file

```env
# Authentication Credentials
USERNAME_1=admin
PASSWORD_1=admin123

USERNAME_2=manager
PASSWORD_2=manager456

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

