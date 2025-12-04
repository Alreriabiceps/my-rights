# ⚡ Quick: Create New Firebase Project

## 5-Minute Setup

### 1. Create Project
- Go to: https://console.firebase.google.com/
- Click **"Add project"**
- Name: `legaize-app`
- Click through (disable Analytics if you want)
- Wait ~30 seconds

### 2. Add Web App
- Click **Web icon** (`</>`)
- Name: `LegAIze Web`
- Click **Register app**
- **Copy the config values**

### 3. Update `.env.local`
Replace Firebase values with new ones from step 2.

### 4. Enable Services (All in Firebase Console)
- **Authentication** → Get Started → Email/Password → Enable
- **Firestore** → Create database → Test mode → Enable
- **Storage** → Get started → Test mode → Enable

### 5. Set Security Rules
Copy rules from `FIREBASE_NEW_PROJECT.md` (Firestore & Storage)

### 6. Restart Server
```bash
Ctrl+C
npm run dev
```

### 7. Test! ✅
Click profile → Sign up → Should work!

---

**Total time: ~5 minutes**
**Result: Clean, working Firebase setup**

