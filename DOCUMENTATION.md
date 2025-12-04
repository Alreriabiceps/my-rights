# LegAIze - Your Legal First AI-d

## App Name

**LegAIze** - "Know Your Rights. LegAIze Your Fight."

## Problem

Many Filipinos face legal issues but are unaware of their rights under Philippine law. People often resort to informal resolutions or illegal actions because they don't know legal solutions exist or how to pursue them. There is a critical gap in legal awareness - people need to understand they have rights and proper legal channels to address concerns.

## Objective

To empower Filipinos with legal awareness by providing an AI-powered platform that helps users discover their rights, understand relevant Philippine laws, learn proper legal approaches, and connect with qualified lawyers - shifting people from informal or harmful actions toward legal, legitimate solutions.

## Solution

A web-based legal education application powered by Google Gemini AI that analyzes user legal situations (text/voice input), educates about rights and relevant Philippine laws, explains proper legal approaches, recommends lawyers and government agencies, provides evidence guidance and timelines. The platform offers bilingual support (English/Filipino) and case history storage.

## Core Features

**AI-Powered Legal Education & Analysis**: Analyzes legal situations via text/voice input, educates users about their rights under Philippine law, identifies relevant laws (Civil Code, Labor Code, Criminal Code), explains proper legal procedures, recommends lawyers with location-based matching and interactive maps, provides cost estimates, timelines with statute of limitations, evidence guides, government agency contacts, risk assessments, and maintains case history. Includes bilingual support (English/Filipino) and searchable knowledge base.

## Tech Stack

**Frontend**: Next.js 16.0.6, React 19.2.0, Tailwind CSS 4, Radix UI, Leaflet maps | **Backend**: Next.js API Routes, Node.js | **AI**: Google Gemini AI (gemini-pro, gemini-1.5-flash) | **Database**: Firebase (Firestore, Auth, Storage) | **Additional**: Web Speech API, html2pdf.js/jsPDF, React Context API

## Implementation

Next.js App Router architecture processes user input (text/voice) through `/api/analyze` endpoint, constructs prompts with Philippine laws database, and sends to Gemini AI. AI response is parsed into structured JSON (case analysis, rights, laws, legal approaches, lawyers, costs, timelines). Results displayed in ResultsView with interactive maps, lawyer cards, and actionable guidance. Firebase handles authentication, case history, and document storage. Fully responsive UI with bilingual support, voice input, and accessibility features. Error handling with fallback data ensures legal education accessibility for all Filipinos.
