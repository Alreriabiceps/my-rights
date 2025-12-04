# Application Architecture Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Current Technology Stack](#current-technology-stack)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [Component Structure](#component-structure)
6. [API Architecture](#api-architecture)
7. [Firebase Integration](#firebase-integration)
8. [Key Features](#key-features)
9. [Flutter Migration Plan](#flutter-migration-plan)
10. [Firebase Setup for Flutter](#firebase-setup-for-flutter)
11. [Recommended Flutter Architecture](#recommended-flutter-architecture)

---

## Application Overview

**App Name:** LegAIze - Your Legal First AI-d

**Tagline:** "Your Legal First AI-d"

**Slogan:** "Know Your Rights. LegAIze Your Fight."

**Purpose:** A legal assistance application that helps users understand their legal rights under Philippine law. The app analyzes user-submitted legal situations (via text or voice input), provides relevant Philippine laws, recommends qualified lawyers, estimates costs, and guides users through the legal process.

**Primary Features:**
- Legal case analysis using AI (Google Gemini)
- Text and voice input support (Filipino/Tagalog)
- Relevant Philippine law identification
- Lawyer recommendations with location-based filtering
- Interactive map showing lawyer locations
- Cost estimation
- Government agency recommendations
- Evidence collection guidance
- Risk assessment

**Target Platform:** Web (currently Next.js), migrating to Mobile (Flutter)

---

## Current Technology Stack

### Frontend
- **Framework:** Next.js 16.0.1
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4
- **Maps:** Leaflet (react-leaflet)
- **Type Safety:** TypeScript 5

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **AI Service:** Google Gemini AI (gemini-pro, gemini-1.5-flash)
- **API Format:** RESTful API

### Database & Services
- **Database:** Firebase Firestore (configured)
- **Authentication:** Firebase Auth (configured)
- **Storage:** Firebase Storage (configured via config)

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
GEMINI_API_KEY
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Web App    │  │  Voice Input │  │ File Upload  │ │
│  │  (Next.js)   │  │  (Web Speech)│  │              │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Route     │
                    │  /api/analyze   │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐    ┌───────▼───────┐  ┌──────▼──────┐
    │  Gemini   │    │   Constants   │  │  Firebase   │
    │    AI     │    │   (Laws DB)   │  │  Firestore  │
    │           │    │               │  │             │
    │  Analyze  │    │  PHILIPPINE   │  │  Lawyers    │
    │   Case    │    │     LAWS      │  │   Data      │
    └───────────┘    └───────────────┘  └─────────────┘
                             │
                    ┌────────▼────────┐
                    │  Parse & Format │
                    │  Response Data  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Results View   │
                    │   Components    │
                    └─────────────────┘
```

### Request Flow

1. **User Input**
   - User submits case description (text or voice)
   - Optional: Upload supporting documents
   - Form data sent to `/api/analyze`

2. **API Processing**
   - Validates input
   - Fetches available Gemini models
   - Constructs legal analysis prompt with:
     - User's case description
     - Philippine laws database
     - Structured JSON output requirements
   - Calls Gemini AI API

3. **AI Analysis**
   - Gemini analyzes the case
   - Identifies case type (Property, Criminal, Labor, etc.)
   - Determines severity and complexity
   - Extracts relevant laws
   - Calculates timeline and statute of limitations
   - Lists user rights
   - Estimates costs
   - Recommends government agencies

4. **Data Enrichment**
   - Matches relevant lawyers from constants
   - Filters by case type and specialization
   - Adds lawyer location data for mapping
   - Parses and validates JSON response

5. **Response Rendering**
   - Results displayed in ResultsView component
   - Interactive map with lawyer locations
   - Cost estimates
   - Timeline visualization
   - Next steps checklist

---

## Data Models

### Core Type Definitions

```typescript
// Case Analysis Result
interface CaseAnalysis {
  caseType: string; // "Property" | "Criminal" | "Labor" | "Family Law" | etc.
  severity: CaseSeverity;
  timeline: CaseTimeline;
  relevantLaws: RelevantLaw[];
  rights: string[];
  lawyers: Lawyer[];
  essentialDocuments: string[];
  nextSteps: NextStep[];
  estimatedCosts?: EstimatedCosts;
  riskAssessment?: RiskAssessment;
  governmentAgencies?: GovernmentAgency[];
  evidenceGuide?: EvidenceItem[];
}

// Severity Assessment
interface CaseSeverity {
  rating: "low" | "medium" | "high";
  complexity: number; // 1-10 scale
  financialImpact: string;
  timeSensitivity: string;
}

// Timeline Information
interface CaseTimeline {
  issueDuration: string;
  statuteOfLimitations: StatuteOfLimitations;
  estimatedResolution: string;
  milestones: TimelineMilestone[];
}

interface StatuteOfLimitations {
  applicable: boolean;
  deadline: Date | null;
  daysRemaining: number | null;
  warning: string | null;
}

// Relevant Law
interface RelevantLaw {
  title: string;
  law: string; // Citation (e.g., "Civil Code of the Philippines, Article 1134")
  description: string;
  relevance: "high" | "medium" | "low";
}

// Lawyer Information
interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  location: string;
  contact: string;
  email?: string;
  startingPrice: string;
  distance: string;
  rating?: number;
  experience?: string;
  bio?: string;
  education?: string[];
  barMembership?: string;
  practiceAreas?: string[];
  languages?: string[];
  officeAddress?: string;
  consultationFee?: string;
  availability?: string;
  casesHandled?: number;
  successRate?: string;
  latitude?: number;
  longitude?: number;
}

// Cost Estimation
interface EstimatedCosts {
  consultationFee: string;
  filingFees: string;
  totalEstimated: string;
  paymentPlan?: string;
  additionalCosts?: string;
  costBreakdown?: string;
}

// Next Steps
interface NextStep {
  action: string;
  priority: "high" | "medium" | "low";
  deadline?: Date | string | null;
}

// Government Agency
interface GovernmentAgency {
  name: string;
  purpose: string;
  contact: string;
  website?: string;
}

// Evidence Item
interface EvidenceItem {
  item: string;
  description: string;
  importance: "critical" | "important" | "helpful";
}

// Risk Assessment
interface RiskAssessment {
  inactionRisks: string[];
  actionBenefits: string[];
  urgencyLevel: "low" | "medium" | "high";
}
```

### Firestore Collections Structure

```
firestore/
├── lawyers/
│   ├── {lawyerId}/
│   │   ├── name: string
│   │   ├── specialization: string
│   │   ├── location: GeoPoint
│   │   ├── contact: string
│   │   └── ... (all Lawyer fields)
│
├── cases/
│   ├── {caseId}/
│   │   ├── userId: string
│   │   ├── description: string
│   │   ├── caseType: string
│   │   ├── analysis: CaseAnalysis
│   │   ├── createdAt: Timestamp
│   │   └── status: string
│
├── laws/
│   ├── {lawId}/
│   │   ├── title: string
│   │   ├── citation: string
│   │   ├── description: string
│   │   └── category: string
│
└── users/
    ├── {userId}/
    │   ├── email: string
    │   ├── name: string
    │   ├── cases: array<caseId>
    │   └── createdAt: Timestamp
```

---

## Component Structure

### Component Hierarchy

```
app/
├── page.tsx (Main Entry)
│   ├── Form Input (Text/Voice)
│   ├── File Upload
│   └── Submit Button
│
└── components/
    ├── ResultsView.tsx (Main Results Container)
    │   ├── CaseSummary.tsx
    │   ├── LawCard.tsx (List of RelevantLaws)
    │   ├── Rights List
    │   ├── LawyersMap.tsx (Leaflet Map)
    │   ├── LawyerCard.tsx (List of Lawyers)
    │   │   └── LawyerProfileModal.tsx
    │   ├── CostEstimate.tsx
    │   ├── GovernmentAgencies.tsx
    │   ├── EvidenceGuide.tsx
    │   └── RiskAssessment.tsx
    │
    └── Individual Components:
        - CaseSummary.tsx: Displays case type, severity, timeline
        - CostEstimate.tsx: Shows cost breakdown
        - EvidenceGuide.tsx: Lists required evidence
        - GovernmentAgencies.tsx: Lists relevant agencies
        - LawCard.tsx: Displays individual law cards
        - LawyerCard.tsx: Shows lawyer preview cards
        - LawyerProfileModal.tsx: Detailed lawyer information modal
        - LawyersMap.tsx: Interactive map with lawyer markers
        - RiskAssessment.tsx: Shows risks and benefits
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `page.tsx` | Main entry point, form handling, voice recording, API submission |
| `ResultsView.tsx` | Orchestrates all result components, manages lawyer selection |
| `CaseSummary.tsx` | Displays case overview, severity, timeline milestones |
| `LawCard.tsx` | Displays individual relevant law with relevance indicator |
| `LawyerCard.tsx` | Shows lawyer preview with contact info and view profile action |
| `LawyerProfileModal.tsx` | Modal with detailed lawyer information |
| `LawyersMap.tsx` | Interactive Leaflet map showing lawyer locations |
| `CostEstimate.tsx` | Displays cost breakdown and payment plan info |
| `GovernmentAgencies.tsx` | Lists relevant government agencies with contact info |
| `EvidenceGuide.tsx` | Shows required evidence items by importance |
| `RiskAssessment.tsx` | Displays action/inaction risks and urgency |

---

## API Architecture

### Endpoint: `/api/analyze`

**Method:** POST  
**Content-Type:** multipart/form-data

#### Request Body
```
FormData {
  description: string (required)
  files: File[] (optional)
}
```

#### Response
```json
{
  "caseType": "Property",
  "severity": { ... },
  "timeline": { ... },
  "relevantLaws": [ ... ],
  "rights": [ ... ],
  "lawyers": [ ... ],
  "essentialDocuments": [ ... ],
  "nextSteps": [ ... ],
  "estimatedCosts": { ... },
  "governmentAgencies": [ ... ]
}
```

#### API Processing Flow

1. **Validation**
   - Check description presence
   - Validate Gemini API key

2. **Model Selection**
   - Fetch available Gemini models via REST API
   - Try models in order: detected model → gemini-pro → gemini-1.5-flash

3. **Prompt Construction**
   - Include user description
   - Add Philippine laws database context
   - Specify JSON output structure (Tagalog language)
   - Include detailed instructions for analysis

4. **AI Call**
   - Generate content using Gemini
   - Extract JSON from response (handle markdown code blocks)

5. **Response Parsing**
   - Parse JSON response
   - Validate structure
   - Match laws with database
   - Filter lawyers by case type
   - Calculate dates and deadlines
   - Fallback to mock data if parsing fails

6. **Error Handling**
   - API key missing → 500 error
   - No models available → 500 error with helpful message
   - Parsing failure → Fallback analysis
   - Network errors → 500 error

### Prompt Engineering

The AI prompt includes:
- Role definition (legal expert specializing in Philippine law)
- User case description
- Available Philippine laws database
- Detailed JSON schema specification
- Language requirement (Tagalog/Filipino)
- Analysis instructions (case type, severity, laws, rights, costs, etc.)

---

## Firebase Integration

### Current Configuration

**File:** `lib/firebase.ts`

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Firebase Services Used

1. **Firestore Database**
   - Configured but not heavily used in current implementation
   - Lawyers data is currently in constants file
   - Recommended: Migrate lawyer data to Firestore

2. **Firebase Authentication**
   - Configured but not implemented in UI
   - Recommended: Add user authentication for case history

3. **Firebase Storage**
   - Configured but not used
   - Recommended: Use for document uploads

### Recommended Firebase Structure for Flutter

```
firestore/
├── lawyers/
│   └── {lawyerId}/
│       ├── basicInfo: { name, specialization, ... }
│       ├── location: GeoPoint
│       ├── contact: { phone, email, address }
│       ├── credentials: { barMembership, education }
│       └── stats: { rating, casesHandled, successRate }
│
├── laws/
│   └── {lawId}/
│       ├── title: string
│       ├── citation: string
│       ├── description: string
│       ├── category: string[]
│       └── relevance: number (search ranking)
│
├── cases/
│   └── {caseId}/
│       ├── userId: string (reference)
│       ├── input: { description, files }
│       ├── analysis: CaseAnalysis
│       ├── metadata: { createdAt, updatedAt, status }
│       └── interactions: { lawyerViews, shares }
│
├── users/
│   └── {userId}/
│       ├── profile: { name, email, phone }
│       ├── preferences: { language, location }
│       ├── caseHistory: array<caseId>
│       └── savedLawyers: array<lawyerId>
│
└── analytics/
    └── usage/
        └── {date}/
            ├── totalCases: number
            ├── caseTypes: map<string, number>
            └── popularLaws: array<lawId>
```

---

## Key Features

### 1. Legal Case Analysis
- **Input Methods:** Text input, Voice recording (Web Speech API)
- **Language Support:** Filipino/Tagalog
- **AI Processing:** Google Gemini AI
- **Output:** Comprehensive case analysis with structured data

### 2. Relevant Law Identification
- Database of Philippine laws
- AI matches relevant laws to case
- Relevance ranking (high/medium/low)
- Law citations and descriptions

### 3. Lawyer Recommendations
- Location-based filtering
- Specialization matching
- Distance calculation
- Rating and experience display
- Interactive map visualization

### 4. Cost Estimation
- Consultation fee ranges
- Filing fee estimates
- Total cost breakdown
- Payment plan information

### 5. Timeline & Deadlines
- Statute of limitations calculation
- Estimated resolution time
- Milestone tracking
- Deadline warnings

### 6. Government Agency Recommendations
- Relevant agency identification
- Contact information
- Purpose explanation

### 7. Evidence Guide
- Required documents list
- Importance levels (critical/important/helpful)
- Collection guidance

### 8. Risk Assessment
- Inaction risks
- Action benefits
- Urgency level

---

## Flutter Migration Plan

### Phase 1: Project Setup
1. Create Flutter project
2. Configure Firebase for Flutter
3. Set up project structure (Clean Architecture)
4. Add dependencies (Firebase, Google Maps, etc.)

### Phase 2: Core Functionality
1. **UI/UX Replication**
   - Home screen with input form
   - Text and voice input components
   - File upload functionality
   - Results display screens

2. **State Management**
   - Implement Provider/Riverpod/Bloc
   - Case analysis state
   - Form state management
   - Navigation state

3. **API Integration**
   - HTTP client setup
   - Gemini API integration
   - Error handling
   - Loading states

### Phase 3: Advanced Features
1. **Maps Integration**
   - Google Maps Flutter plugin
   - Lawyer location markers
   - Distance calculation
   - Directions integration

2. **Firebase Integration**
   - Firestore for lawyer data
   - Authentication
   - Storage for documents
   - Analytics

3. **Voice Input**
   - Speech-to-text plugin
   - Filipino language support
   - Recording management

### Phase 4: Enhancements
1. Offline support
2. Push notifications
3. Case history
4. User profiles
5. Saved lawyers

---

## Firebase Setup for Flutter

### 1. Create Flutter Project

```bash
flutter create know_your_rights
cd know_your_rights
```

### 2. Add Dependencies

**pubspec.yaml:**
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Firebase
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  cloud_firestore: ^4.13.6
  firebase_storage: ^11.5.6
  firebase_analytics: ^10.7.4
  
  # State Management
  provider: ^6.1.1
  # OR
  flutter_riverpod: ^2.4.9
  
  # HTTP & API
  http: ^1.1.2
  dio: ^5.4.0
  
  # Maps
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  
  # Voice Input
  speech_to_text: ^6.6.0
  permission_handler: ^11.1.0
  
  # File Handling
  file_picker: ^6.1.1
  image_picker: ^1.0.7
  
  # UI
  flutter_localizations:
    sdk: flutter
  intl: ^0.19.0
```

### 3. Firebase Configuration

1. **Create Firebase Project** (if not exists)
   - Go to Firebase Console
   - Create new project or use existing

2. **Add Flutter Apps**
   - Add Android app (register package name)
   - Add iOS app (register bundle ID)
   - Download configuration files:
     - `google-services.json` (Android)
     - `GoogleService-Info.plist` (iOS)

3. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   flutterfire configure
   ```

4. **Enable Firebase Services**
   - Authentication: Email/Password, Phone
   - Firestore: Create database
   - Storage: Enable storage

### 4. Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lawyers collection - public read
    match /lawyers/{lawyerId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Cases collection - user-specific
    match /cases/{caseId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Laws collection - public read
    match /laws/{lawId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cases/{userId}/{caseId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Recommended Flutter Architecture

### Clean Architecture Structure

```
lib/
├── main.dart
├── core/
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_constants.dart
│   │   └── firebase_constants.dart
│   ├── network/
│   │   ├── api_client.dart
│   │   ├── api_interceptor.dart
│   │   └── api_endpoints.dart
│   ├── utils/
│   │   ├── validators.dart
│   │   ├── date_formatter.dart
│   │   └── helpers.dart
│   └── theme/
│       ├── app_theme.dart
│       └── colors.dart
│
├── data/
│   ├── models/
│   │   ├── case_analysis.dart
│   │   ├── lawyer.dart
│   │   ├── relevant_law.dart
│   │   └── ...
│   ├── repositories/
│   │   ├── case_repository.dart
│   │   ├── lawyer_repository.dart
│   │   └── law_repository.dart
│   └── datasources/
│       ├── remote/
│       │   ├── gemini_api.dart
│       │   ├── firebase_lawyer_datasource.dart
│       │   └── firebase_case_datasource.dart
│       └── local/
│           └── local_storage.dart
│
├── domain/
│   ├── entities/
│   │   ├── case_analysis_entity.dart
│   │   ├── lawyer_entity.dart
│   │   └── ...
│   ├── repositories/
│   │   ├── case_repository_interface.dart
│   │   └── lawyer_repository_interface.dart
│   └── usecases/
│       ├── analyze_case_usecase.dart
│       ├── get_lawyers_usecase.dart
│       └── save_case_usecase.dart
│
├── presentation/
│   ├── providers/ (or bloc/cubit)
│   │   ├── case_analysis_provider.dart
│   │   ├── lawyer_provider.dart
│   │   └── voice_input_provider.dart
│   ├── screens/
│   │   ├── home/
│   │   │   ├── home_screen.dart
│   │   │   └── widgets/
│   │   │       ├── case_input_form.dart
│   │   │       ├── voice_input_widget.dart
│   │   │       └── file_upload_widget.dart
│   │   ├── results/
│   │   │   ├── results_screen.dart
│   │   │   └── widgets/
│   │   │       ├── case_summary_widget.dart
│   │   │       ├── law_list_widget.dart
│   │   │       ├── lawyer_map_widget.dart
│   │   │       └── ...
│   │   └── lawyer_details/
│   │       └── lawyer_details_screen.dart
│   └── widgets/
│       ├── common/
│       │   ├── loading_widget.dart
│       │   ├── error_widget.dart
│       │   └── custom_button.dart
│       └── cards/
│           ├── law_card.dart
│           └── lawyer_card.dart
│
└── firebase/
    ├── firebase_options.dart
    └── firebase_service.dart
```

### Key Flutter Packages & Services

#### 1. State Management
- **Provider** or **Riverpod** (recommended for simplicity)
- **Bloc** (for complex state management)

#### 2. Navigation
- **go_router** (declarative routing)

#### 3. Maps
- **google_maps_flutter** (Google Maps)
- **geolocator** (location services)

#### 4. Voice Input
- **speech_to_text** (speech recognition)
- **permission_handler** (microphone permissions)

#### 5. HTTP Client
- **dio** (advanced HTTP client with interceptors)
- **http** (simple HTTP requests)

#### 6. Local Storage
- **shared_preferences** (key-value storage)
- **hive** (NoSQL database)

#### 7. File Handling
- **file_picker** (document selection)
- **image_picker** (image selection)
- **path_provider** (file paths)

### State Management Example (Riverpod)

```dart
// providers/case_analysis_provider.dart
final caseAnalysisProvider = StateNotifierProvider<CaseAnalysisNotifier, CaseAnalysisState>((ref) {
  return CaseAnalysisNotifier(
    ref.read(analyzeCaseUsecaseProvider),
  );
});

class CaseAnalysisNotifier extends StateNotifier<CaseAnalysisState> {
  final AnalyzeCaseUsecase _analyzeCaseUsecase;
  
  CaseAnalysisNotifier(this._analyzeCaseUsecase) 
    : super(CaseAnalysisState.initial());
  
  Future<void> analyzeCase(String description, List<File> files) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final result = await _analyzeCaseUsecase.execute(description, files);
      state = state.copyWith(
        isLoading: false,
        analysis: result,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}
```

### API Client Setup

```dart
// core/network/api_client.dart
class ApiClient {
  final Dio _dio;
  
  ApiClient() : _dio = Dio(
    BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  ) {
    _dio.interceptors.add(LogInterceptor());
    _dio.interceptors.add(ErrorInterceptor());
  }
  
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.post(path, data: data, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
```

### Gemini API Integration

```dart
// data/datasources/remote/gemini_api.dart
class GeminiApi {
  final ApiClient _apiClient;
  final String _apiKey;
  
  Future<CaseAnalysisModel> analyzeCase(String description) async {
    final formData = FormData.fromMap({
      'description': description,
    });
    
    final response = await _apiClient.post(
      '/api/analyze',
      data: formData,
    );
    
    return CaseAnalysisModel.fromJson(response.data);
  }
}
```

### Maps Integration

```dart
// presentation/widgets/lawyer_map_widget.dart
class LawyerMapWidget extends StatelessWidget {
  final List<Lawyer> lawyers;
  
  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      initialCameraPosition: CameraPosition(
        target: _calculateCenter(),
        zoom: 12,
      ),
      markers: _createMarkers(),
      mapType: MapType.normal,
    );
  }
  
  Set<Marker> _createMarkers() {
    return lawyers.map((lawyer) {
      return Marker(
        markerId: MarkerId(lawyer.id),
        position: LatLng(lawyer.latitude!, lawyer.longitude!),
        infoWindow: InfoWindow(
          title: lawyer.name,
          snippet: lawyer.specialization,
        ),
      );
    }).toSet();
  }
}
```

### Voice Input Implementation

```dart
// presentation/widgets/voice_input_widget.dart
class VoiceInputWidget extends StatefulWidget {
  @override
  _VoiceInputWidgetState createState() => _VoiceInputWidgetState();
}

class _VoiceInputWidgetState extends State<VoiceInputWidget> {
  final SpeechToText _speech = SpeechToText();
  bool _isListening = false;
  String _transcript = '';
  
  @override
  void initState() {
    super.initState();
    _initializeSpeech();
  }
  
  Future<void> _initializeSpeech() async {
    await _speech.initialize(
      onStatus: (status) => print('Status: $status'),
      onError: (error) => print('Error: $error'),
    );
  }
  
  Future<void> _startListening() async {
    await _speech.listen(
      onResult: (result) {
        setState(() {
          _transcript = result.recognizedWords;
        });
      },
      localeId: 'fil_PH', // Filipino
      listenOptions: SpeechListenOptions(
        partialResults: true,
        cancelOnError: true,
      ),
    );
  }
  
  void _stopListening() {
    _speech.stop();
    setState(() {
      _isListening = false;
    });
  }
}
```

---

## Environment Variables for Flutter

Create `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Use `flutter_dotenv` package to load:

```dart
await dotenv.load(fileName: ".env");
final geminiApiKey = dotenv.env['GEMINI_API_KEY'];
```

---

## Testing Strategy

### Unit Tests
- Usecases
- Repositories
- Models
- Utils

### Widget Tests
- Individual widgets
- Screen components
- User interactions

### Integration Tests
- Full user flows
- API integration
- Firebase operations

### Example Test Structure

```
test/
├── unit/
│   ├── usecases/
│   ├── repositories/
│   └── models/
├── widget/
│   └── screens/
└── integration/
    └── flows/
```

---

## Performance Considerations

### 1. Image Optimization
- Use cached_network_image for lawyer photos
- Compress uploaded documents

### 2. API Caching
- Cache case analyses
- Store lawyer data locally
- Offline-first approach

### 3. Lazy Loading
- Paginate lawyer list
- Load maps on demand
- Defer non-critical components

### 4. Code Splitting
- Separate feature modules
- Load features on demand

---

## Security Considerations

### 1. API Key Protection
- Store API keys securely (use flutter_dotenv)
- Never commit keys to version control
- Use environment variables

### 2. Firebase Security Rules
- Enforce proper read/write permissions
- Validate user authentication
- Sanitize user inputs

### 3. Data Validation
- Validate all inputs
- Sanitize file uploads
- Implement rate limiting

### 4. Encryption
- Encrypt sensitive data in local storage
- Use HTTPS for all API calls

---

## Deployment Checklist

### Android
- [ ] Configure AndroidManifest.xml
- [ ] Set up signing keys
- [ ] Add Google Maps API key
- [ ] Configure Firebase
- [ ] Test on various Android versions
- [ ] Generate release APK/AAB

### iOS
- [ ] Configure Info.plist
- [ ] Set up certificates and provisioning
- [ ] Add Google Maps API key
- [ ] Configure Firebase
- [ ] Request location/microphone permissions
- [ ] Test on various iOS versions
- [ ] Archive for App Store

### Firebase
- [ ] Set up production Firebase project
- [ ] Configure security rules
- [ ] Set up analytics
- [ ] Configure crash reporting
- [ ] Test authentication flows

---

## Migration Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Setup | Project creation, Firebase setup, dependencies | 1 week |
| Phase 2: Core UI | Home screen, form input, results display | 2-3 weeks |
| Phase 3: Features | Voice input, maps, file upload | 2-3 weeks |
| Phase 4: Integration | API integration, Firebase sync | 2 weeks |
| Phase 5: Polish | UI refinement, testing, bug fixes | 2 weeks |
| Phase 6: Deployment | App store setup, release | 1 week |

**Total Estimated Time: 10-12 weeks**

---

## Additional Resources

### Flutter Documentation
- [Flutter Docs](https://docs.flutter.dev/)
- [Firebase Flutter Setup](https://firebase.flutter.dev/)
- [Google Maps Flutter](https://pub.dev/packages/google_maps_flutter)
- [Speech to Text](https://pub.dev/packages/speech_to_text)

### Firebase Documentation
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage](https://firebase.google.com/docs/storage)

### Design Resources
- [Material Design](https://material.io/design)
- [Flutter Widget Catalog](https://docs.flutter.dev/ui/widgets)

---

## Conclusion

This architecture document provides a comprehensive guide for migrating the "LegAIze" application from Next.js to Flutter with Firebase. The modular architecture ensures maintainability, testability, and scalability. Follow the phased migration plan and refer to the code examples for implementation guidance.

For questions or clarifications, refer to the individual component documentation or consult the Flutter and Firebase official documentation.

---

**Last Updated:** 2024  
**Version:** 1.0  
**Maintained By:** Development Team

