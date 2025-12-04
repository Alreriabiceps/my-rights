# ⚡ QUICK FIX - Firebase API Key Error

## Do This Now:

1. **Create `.env.local` file** in project root (`E:\projects\next\my-rights\`)

2. **Get Firebase config from Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select your project → ⚙️ Settings → Project settings
   - Scroll to "Your apps" → Copy config values

3. **Paste into `.env.local`:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste_your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paste_your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paste_your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paste_your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=paste_your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=paste_your_app_id_here
GEMINI_API_KEY=your_gemini_key_if_you_have_it
```

4. **RESTART dev server:**
   - Stop: `Ctrl+C`
   - Start: `npm run dev`

5. **Test:** Click profile button - should work now! ✅

## File Location:
```
E:\projects\next\my-rights\.env.local
```

## ⚠️ Important:
- File name MUST be `.env.local` (not `.env` or `.env.local.txt`)
- Restart server after creating/editing `.env.local`
- No quotes around values
- No spaces around `=`

