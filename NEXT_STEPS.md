# 🚀 Next Steps - Setup & Testing Guide

## ✅ Step 1: Set Up Firebase (REQUIRED)

### 1.1 Enable Authentication Methods

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Authentication → Sign-in method

Enable these providers:
- ✅ **Email/Password** - Click "Enable" and save
- ✅ **Google** - Click "Enable", add your support email, and save

### 1.2 Set Up Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules tab

Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cases collection - users can only access their own cases
    match /cases/{caseId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
    
    // Documents collection - users can only access their own documents
    match /documents/{documentId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click **"Publish"** to save the rules.

### 1.3 Set Up Firebase Storage Security Rules

Go to Firebase Console → Storage → Rules tab

Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cases/{userId}/{caseId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

Click **"Publish"** to save the rules.

### 1.4 Verify Environment Variables

Make sure your `.env.local` file has all Firebase variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key
```

## ✅ Step 2: Test the Features

### 2.1 Start the Development Server

```bash
npm run dev
```

### 2.2 Test Authentication

1. **Sign Up**
   - Click the profile button in the header
   - Click "Sign Up"
   - Create an account with email/password OR use Google sign-in
   - Verify you're logged in (your name/email should appear)

2. **Sign Out & Sign In**
   - Click profile → Sign Out
   - Sign back in with your credentials

### 2.3 Test Case History

1. **Analyze a Case**
   - While logged in, analyze a legal case
   - The case should automatically save to Firestore

2. **View Case History**
   - Click the "Case History" button in the header
   - You should see your saved case
   - Click "View Case" to restore it

3. **Test Deadline Tracking**
   - Cases with deadlines should show days remaining
   - Overdue cases should be highlighted in red

### 2.4 Test Profile Management

1. **Update Profile**
   - Click your profile button
   - Update your display name
   - Click "Save Changes"
   - Verify the change persists

## ✅ Step 3: Optional Enhancements

### Priority Features Still Available:

1. **📄 Document Management UI** (High Priority)
   - Update FileUpload component to save to Firebase Storage
   - Show uploaded documents in case history
   - Allow document deletion

2. **🔔 Deadline Reminders** (High Priority)
   - Notification system for upcoming deadlines
   - Email notifications (using Firebase Cloud Functions)
   - In-app notifications

3. **💬 AI Chat Assistant** (Medium Priority)
   - Follow-up questions about cases
   - Clarification requests
   - Legal term explanations

4. **📝 Case Notes** (Medium Priority)
   - Add notes to saved cases
   - Edit case notes
   - Notes history

5. **🔗 Case Sharing** (Low Priority)
   - Share cases with lawyers
   - Generate shareable links
   - Privacy controls

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure all Firebase environment variables are set correctly in `.env.local`

### Issue: "Permission denied" when saving cases
**Solution:** Check Firestore security rules are published correctly

### Issue: Google sign-in not working
**Solution:** 
- Verify Google OAuth is enabled in Firebase Console
- Check that authorized domains include your localhost/domain
- Make sure support email is set in Google provider settings

### Issue: Cases not saving
**Solution:**
- Check browser console for errors
- Verify user is logged in
- Check Firestore rules allow create operations

## 📊 Check Firebase Console

After testing, verify in Firebase Console:

1. **Authentication** → Users tab → Should see your test user
2. **Firestore Database** → Should see `users` and `cases` collections
3. **Storage** → Should be empty until document uploads are implemented

## 🎯 Recommended Next Implementation

I recommend implementing **Document Management UI** next because:
- It's high-impact (users can attach documents to cases)
- It uses the service we already created
- It completes the case management workflow
- It's relatively straightforward to implement

Would you like me to implement any of these features now?

