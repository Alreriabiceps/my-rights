# 🆕 Create New Firebase Project - Step by Step

## Should You Create a New Project?

**Create a new project if:**
- ✅ Current project is shared with other apps/systems
- ✅ You want a clean slate for this app
- ✅ Current project has complex restrictions
- ✅ You're having trouble fixing the current setup

**Keep current project if:**
- ✅ You can easily enable Authentication
- ✅ You want to keep existing data
- ✅ Project is only for this app

## 🚀 Option 1: Create New Firebase Project (Recommended for Clean Start)

### Step 1: Create New Project in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `legaize-app` (or any name you prefer)
4. Click **Continue**
5. **Disable Google Analytics** (optional, for simplicity) or enable it
6. Click **Create project**
7. Wait for project to be created (~30 seconds)
8. Click **Continue**

### Step 2: Add Web App

1. In your new project, click the **Web icon** (`</>`)
2. Register app:
   - App nickname: `LegAIze Web`
   - (Optional) Set up Firebase Hosting: **Not now**
   - Click **Register app**

### Step 3: Copy Firebase Config

You'll see a config like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "legaize-app.firebaseapp.com",
  projectId: "legaize-app",
  storageBucket: "legaize-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 4: Update Your `.env.local`

Replace your current Firebase values with the new ones:

```env
# New Firebase Project Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=legaize-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=legaize-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=legaize-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Keep your Gemini key
GEMINI_API_KEY=AIzaSyCETjpMkHyy0mB3mcK-diYb2B1PRTnddNY
```

### Step 5: Enable Authentication (Fresh Project)

1. In Firebase Console → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

### Step 6: Enable Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select location (choose closest to you)
5. Click **Enable**

### Step 7: Enable Storage

1. In Firebase Console → **Storage**
2. Click **Get started**
3. Start in **test mode**
4. Choose same location as Firestore
5. Click **Done**

### Step 8: Set Up Security Rules

#### Firestore Rules:
1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /cases/{caseId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
    match /documents/{documentId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

#### Storage Rules:
1. Go to **Storage** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cases/{userId}/{caseId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

3. Click **Publish**

### Step 9: Restart Your Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 10: Test!

1. Open your app
2. Click profile button
3. Try signing up
4. Should work! ✅

## 🔄 Option 2: Fix Current Project (If You Want to Keep It)

If you prefer to fix the current project instead:

### Quick Fix Steps:

1. **Enable Authentication:**
   - Firebase Console → Authentication → Get Started
   - Sign-in method → Email/Password → Enable

2. **Enable APIs in Google Cloud:**
   - Go to Google Cloud Console
   - APIs & Services → Library
   - Enable: Identity Toolkit API, Firebase Authentication API

3. **Check API Key Restrictions:**
   - Google Cloud Console → Credentials
   - Edit your API key
   - Remove restrictions (or add correct APIs)

4. **Restart dev server**

## 📊 Comparison

| Aspect | New Project | Fix Current |
|--------|-------------|-------------|
| **Setup Time** | 5-10 minutes | 2-5 minutes |
| **Clean Slate** | ✅ Yes | ❌ No |
| **Existing Data** | ❌ Lost | ✅ Kept |
| **Complexity** | ✅ Simple | ⚠️ May have issues |
| **Best For** | Fresh start | Keep existing data |

## ✅ Recommendation

**For this app, I recommend creating a NEW project** because:
- ✅ Clean slate, no conflicts
- ✅ Fresh configuration
- ✅ Easier to set up correctly
- ✅ No shared restrictions
- ✅ Better for development/testing

## 🎯 After Creating New Project

Once you've created the new project and updated `.env.local`:

1. ✅ Restart dev server
2. ✅ Test authentication
3. ✅ Everything should work!

## 📝 Notes

- You can have multiple Firebase projects
- Free tier is generous (enough for development)
- You can always switch back to old project
- New project = fresh start, no baggage

