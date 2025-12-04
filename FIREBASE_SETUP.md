# 🔥 Firebase Setup Guide - Fix API Key Error

## The Problem
You're getting: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

This means your Firebase environment variables are not set up correctly.

## ✅ Solution: Create `.env.local` File

### Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **⚙️ Settings** icon → **Project settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app yet:
   - Click **"Add app"** → Select **Web** (</> icon)
   - Register your app (you can name it anything)
   - Copy the config values

### Step 2: Copy Firebase Config Values

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 3: Create `.env.local` File

In your project root (`E:\projects\next\my-rights\`), create a file named `.env.local`

**Important:** The file must be named exactly `.env.local` (not `.env.local.txt`)

Copy this template and fill in your values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Gemini AI Configuration (if you have it)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Restart Your Dev Server

**IMPORTANT:** After creating/updating `.env.local`, you MUST restart your dev server:

1. Stop the server (Ctrl+C)
2. Run `npm run dev` again

Environment variables are only loaded when the server starts!

## 🔍 Verify Your Setup

After restarting, check the browser console. You should NOT see any Firebase errors.

### Quick Test:
1. Open your app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for any Firebase errors
5. Try clicking the profile button - it should work now!

## 🐛 Common Issues

### Issue: "Still getting API key error after setup"
**Solutions:**
- ✅ Make sure file is named `.env.local` (not `.env` or `.env.local.txt`)
- ✅ Restart your dev server (Ctrl+C then `npm run dev`)
- ✅ Check for typos in variable names (must start with `NEXT_PUBLIC_`)
- ✅ Make sure there are no spaces around the `=` sign
- ✅ Don't use quotes around the values in `.env.local`

### Issue: "Can't find Project Settings in Firebase"
**Solution:**
- Click the ⚙️ gear icon next to "Project Overview" in the left sidebar
- Then click "Project settings"

### Issue: "Don't have a web app in Firebase"
**Solution:**
1. In Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Click "Add app" → Select Web icon (</>)
4. Register app (name it anything like "LegAIze Web")
5. Copy the config values

### Issue: "File not found" or "Can't create .env.local"
**Solution:**
- Make sure you're in the project root: `E:\projects\next\my-rights\`
- Use a code editor (VS Code, Notepad++) to create the file
- On Windows, make sure file extensions are visible (View → Show file extensions)

## 📝 Example `.env.local` File

Here's what a complete `.env.local` file should look like:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEf1234567890GhIjKlMnOpQrStUvWxYz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-rights-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-rights-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-rights-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
GEMINI_API_KEY=AIzaSyYourGeminiKeyHere
```

## ✅ After Setup

Once `.env.local` is created and server is restarted:

1. ✅ Firebase authentication should work
2. ✅ You can sign up/sign in
3. ✅ Cases will save to Firestore
4. ✅ No more API key errors!

## 🆘 Still Having Issues?

1. Check browser console for specific error messages
2. Verify all 6 Firebase variables are set
3. Make sure values don't have extra spaces or quotes
4. Restart dev server after any changes
5. Check that `.env.local` is in the project root (same folder as `package.json`)

