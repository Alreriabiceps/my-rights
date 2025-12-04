# 🔧 Troubleshooting Firebase Setup

## Your `.env.local` File Looks Correct! ✅

All your variables are properly formatted with `NEXT_PUBLIC_` prefix.

## If You're Still Getting Errors:

### Step 1: Restart Dev Server (MOST IMPORTANT!)
```bash
# Stop server completely (Ctrl+C)
# Then restart:
npm run dev
```

**Environment variables are ONLY loaded when the server starts!**

### Step 2: Check Browser Console
1. Open your app in browser
2. Press F12 → Console tab
3. Look for Firebase errors
4. Check if you see: `❌ Firebase Configuration Error`

### Step 3: Verify Firebase Project Settings

Go to Firebase Console and check:

1. **Authentication Enabled?**
   - Firebase Console → Authentication → Sign-in method
   - Make sure Email/Password is **Enabled**

2. **API Key Restrictions?**
   - Firebase Console → Project Settings → General
   - Check if API key has restrictions
   - For development, you can temporarily remove restrictions

3. **Authorized Domains?**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Make sure `localhost` is listed

### Step 4: Test Firebase Connection

Add this to your browser console (F12):

```javascript
// Check if Firebase is initialized
console.log("Firebase Auth:", window.firebase?.auth ? "✅" : "❌");

// Check environment variables (if accessible)
console.log("API Key exists:", typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅" : "❌");
```

### Step 5: Common Issues

#### Issue: "API key not valid"
**Possible causes:**
- ✅ API key copied incorrectly (extra spaces?)
- ✅ API key has restrictions (check Firebase Console)
- ✅ Wrong project selected in Firebase Console
- ✅ Dev server not restarted after creating `.env.local`

#### Issue: "auth/configuration-not-found"
**Solution:**
- Enable Authentication in Firebase Console
- Enable Email/Password sign-in method

#### Issue: Storage bucket error
Your bucket uses `.firebasestorage.app` which is correct for newer projects.
If you get storage errors, try:
- Firebase Console → Storage → Check if Storage is enabled
- Check Storage rules are set correctly

### Step 6: Verify File Location

Make sure `.env.local` is in the **project root**:
```
E:\projects\next\my-rights\.env.local  ✅ Correct
E:\projects\next\.env.local            ❌ Wrong
E:\projects\next\my-rights\src\.env.local  ❌ Wrong
```

### Step 7: Check for Hidden Characters

Sometimes copying from docs adds hidden characters. Try:
1. Delete the file
2. Create new `.env.local`
3. Type values manually (don't copy-paste)
4. Restart server

## Quick Test

After restarting server, try this:

1. Open app → Click profile button
2. Should see Sign In modal (not an error)
3. Try signing up with email/password
4. Should work! ✅

## Still Not Working?

Share:
1. Exact error message from browser console
2. Whether you restarted the server
3. Screenshot of Firebase Console → Project Settings → General tab

