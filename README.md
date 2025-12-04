# LegAIze - Your Legal First AI-d

**Know Your Rights. LegAIze Your Fight.**

A web-based legal education application powered by Google Gemini AI that helps Filipinos discover their rights, understand relevant Philippine laws, learn proper legal approaches, and connect with qualified lawyers.

## 🎯 Problem

Many Filipinos face legal issues but are unaware of their rights under Philippine law. People often resort to informal resolutions or illegal actions because they don't know legal solutions exist or how to pursue them. There is a critical gap in legal awareness - people need to understand they have rights and proper legal channels to address concerns.

## ✨ Solution

LegAIze empowers Filipinos with legal awareness by providing an AI-powered platform that:
- Analyzes legal situations via text/voice input
- Educates users about their rights under Philippine law
- Identifies relevant laws (Civil Code, Labor Code, Criminal Code, etc.)
- Explains proper legal procedures and timelines
- Recommends lawyers with location-based matching
- Provides cost estimates and evidence guidance
- Connects users with government agencies
- Maintains case history for tracking

## 🚀 Core Features

- **AI-Powered Legal Analysis**: Get instant legal advice and analysis powered by Google Gemini AI
- **Bilingual Support**: Available in both English and Filipino (Tagalog)
- **Voice Input**: Speak your legal situation directly
- **Case History**: Track and manage all your legal cases
- **Lawyer Recommendations**: Find qualified lawyers near you with interactive maps
- **Document Analysis**: Upload and analyze legal documents (contracts, affidavits, etc.)
- **Knowledge Base**: Search through AI's experience with similar cases
- **Timeline & Deadlines**: Get statute of limitations and important dates
- **Cost Estimates**: Understand potential legal costs
- **Government Agency Contacts**: Connect with relevant agencies

## 🛠️ Tech Stack

**Frontend**: Next.js 16.0.6, React 19.2.0, Tailwind CSS 4, Radix UI, Leaflet maps  
**Backend**: Next.js API Routes, Node.js  
**AI**: Google Gemini AI (gemini-2.0-flash)  
**Database**: Firebase (Firestore, Auth, Storage)  
**Additional**: Web Speech API, html2pdf.js/jsPDF, React Context API

## 📋 Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- Firebase project setup
- Google Gemini API key

## 🏃 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Alreriabiceps/my-rights.git
cd my-rights
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Firebase Documentation](https://firebase.google.com/docs) - learn about Firebase services
- [Google Gemini AI](https://ai.google.dev/) - learn about Gemini AI capabilities

## 🚢 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 👥 Developers

**Russelle Roxas** and **Ysa Victorio**

---

Made with ❤️ for the Filipino people
