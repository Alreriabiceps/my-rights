# 🔧 Fix Firebase 400 Error - API Key Issues

## The Error
```
identitytoolkit.googleapis.com/v1/projects?key=...: Failed to load resource: 400
```

This means Firebase can't authenticate your API key or the Authentication service isn't properly configured.

## ✅ Solution Steps

### Step 1: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **my-rights-pala-ako**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** (if you haven't enabled it yet)
5. Go to **Sign-in method** tab
6. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**

### Step 2: Check API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **my-rights-pala-ako**
3. Go to **APIs & Services** → **Credentials**
4. Find your API key: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (example format)
5. Click on the API key to edit it
6. Check **API restrictions**:
   - If restricted, make sure these APIs are enabled:
     - ✅ Identity Toolkit API
     - ✅ Firebase Authentication API
   - OR temporarily set to **Don't restrict** for testing
7. Check **Application restrictions**:
   - For development, you can set to **None** temporarily
   - Or add your localhost domain

### Step 3: Enable Required APIs

1. In Google Cloud Console → **APIs & Services** → **Library**
2. Search and enable these APIs:
   - ✅ **Identity Toolkit API**
   - ✅ **Firebase Authentication API**
   - ✅ **Cloud Firestore API**
   - ✅ **Cloud Storage API**

### Step 4: Verify Authorized Domains

1. Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Make sure these are listed:
   - `localhost`
   - `my-rights-pala-ako.firebaseapp.com`
   - Your custom domain (if any)

### Step 5: Check Project Billing (if needed)

Some Firebase features require billing to be enabled. Check:
- Firebase Console → **Project Settings** → **Usage and billing**
- If billing is required, enable it (free tier is usually enough for development)

## 🔍 Quick Diagnostic

Run this in your browser console (F12) after the error:

```javascript
// Check if Firebase is trying to initialize
console.log("Checking Firebase...");

// Check your API key format
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "not found";
console.log("API Key length:", apiKey.length);
console.log("API Key starts with AIza:", apiKey.startsWith("AIza"));
```

## 🎯 Most Common Fix

**90% of the time, this is because Authentication isn't enabled:**

1. Firebase Console → Authentication → Get Started
2. Enable Email/Password sign-in method
3. Restart your dev server
4. Try again!

## ✅ After Fixing

1. **Restart your dev server** (Ctrl+C, then `npm run dev`)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Hard refresh** (Ctrl+Shift+R)
4. Try signing in again

## 🐛 Still Not Working?

If you've done all the above and still get 400 errors:

1. **Double-check your API key** in Firebase Console:
   - Project Settings → General → Your apps → Web app
   - Copy the API key again
   - Make sure it matches your `.env.local`

2. **Try creating a new API key**:
   - Google Cloud Console → APIs & Services → Credentials
   - Create new API key
   - Update `.env.local` with new key
   - Restart server

3. **Check Firebase project status**:
   - Make sure project is active (not suspended)
   - Check for any warnings in Firebase Console

## 📝 Checklist

- [ ] Authentication enabled in Firebase Console
- [ ] Email/Password sign-in method enabled
- [ ] Identity Toolkit API enabled in Google Cloud
- [ ] API key has no restrictions (or correct restrictions)
- [ ] Authorized domains include localhost
- [ ] Dev server restarted after changes
- [ ] Browser cache cleared

