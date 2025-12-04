# Knowledge Base System Documentation

## Overview

The Knowledge Base system stores anonymized case data from all users to help the AI learn and improve its analysis. When similar cases appear, the AI can reference past cases to provide more accurate and contextual responses.

## How It Works

### 1. Case Storage
- When a user submits a case for analysis, the case is automatically saved to the `knowledgeBase` collection in Firestore
- **No personal information** is stored - only case characteristics, description, and analysis results
- Each case includes:
  - Case type
  - Description (user input)
  - Relevant laws
  - Rights identified
  - Essential documents
  - Severity assessment
  - Keywords (extracted for matching)

### 2. Similar Case Retrieval
- Before analyzing a new case, the system searches for similar cases from the knowledge base
- Similarity is determined by:
  - Case type matching
  - Keyword matching (extracted from descriptions)
  - Recent cases (fallback)
- Up to 3 similar cases are retrieved and included in the AI prompt

### 3. AI Learning
- The AI receives context from similar past cases
- This helps the AI:
  - Identify patterns in similar cases
  - Apply relevant laws more accurately
  - Provide better recommendations
  - Learn from successful analyses

## Files Created

### `src/lib/knowledgeBaseService.js`
Main service file containing:
- `saveToKnowledgeBase()` - Saves anonymized cases
- `findSimilarCases()` - Finds cases by type
- `findCasesByKeywords()` - Finds cases by keyword matching
- `findSimilarCasesByDescription()` - Smart matching using description

### Updated Files

#### `src/app/api/analyze/route.js`
- Updated `buildPrompt()` to be async and fetch similar cases
- Includes similar cases context in the AI prompt
- Automatically saves cases to knowledge base after analysis

## Firestore Collection Structure

### Collection: `knowledgeBase`

```javascript
{
  caseType: string,              // "Property", "Criminal", etc.
  description: string,            // User's case description (anonymized)
  severity: object,              // Severity assessment
  relevantLaws: array,            // Array of relevant laws
  rights: array,                  // Array of rights identified
  essentialDocuments: array,     // Required documents
  keywords: array,                // Extracted keywords for matching
  tags: array,                    // Case type tags
  complexity: number,            // 1-10 complexity rating
  urgencyLevel: string,          // "low" | "medium" | "high"
  createdAt: Timestamp,          // When case was added
  usageCount: number             // How often used for learning
}
```

## Privacy & Security

### Data Anonymization
- **No user IDs** are stored in the knowledge base
- **No personal information** (names, addresses, contact info)
- Only case characteristics and legal analysis are stored
- Descriptions are stored as-is (users should avoid including personal info)

### Firestore Security Rules

Add these rules to your Firestore security configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... existing rules ...
    
    // Knowledge Base collection
    match /knowledgeBase/{knowledgeId} {
      // Anyone can read (for AI context)
      allow read: if true;
      
      // Only authenticated users can add cases (via API)
      // In production, you might want to restrict this to server-side only
      allow write: if request.auth != null;
    }
  }
}
```

## Firestore Indexes Required

You may need to create composite indexes for efficient queries:

1. **Case Type Query:**
   - Collection: `knowledgeBase`
   - Fields: `caseType` (Ascending), `createdAt` (Descending)

To create indexes:
1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Add the fields above
4. Or wait for Firebase to prompt you when the query runs

## Usage Example

The system works automatically - no manual intervention needed:

1. User submits a case → Case is analyzed
2. System searches for similar cases → Finds 3 similar cases
3. Similar cases are included in AI prompt → AI gets context
4. Case is saved to knowledge base → Available for future cases
5. Next similar case → Benefits from previous cases

## Benefits

1. **Improved Accuracy**: AI learns from past cases
2. **Better Context**: Similar cases provide relevant examples
3. **Pattern Recognition**: Identifies common legal patterns
4. **Scalability**: More cases = better AI performance
5. **Privacy**: No personal data stored

## Future Enhancements

Potential improvements:
- Vector embeddings for semantic similarity search
- Case clustering to group similar cases
- Quality scoring to prioritize better examples
- Analytics dashboard to track knowledge base growth
- Full-text search with Algolia or Elasticsearch
- Machine learning models for better matching

## Troubleshooting

### Cases Not Being Saved
- Check Firebase console for errors
- Verify Firestore security rules allow writes
- Check server logs for error messages

### Similar Cases Not Found
- Knowledge base might be empty (needs cases to build up)
- Check if Firestore indexes are created
- Verify query is working in Firebase console

### Performance Issues
- Limit the number of similar cases retrieved (currently 3)
- Consider pagination for large knowledge bases
- Add caching for frequently accessed cases

## Monitoring

Monitor the knowledge base:
- **Size**: Track collection size in Firebase console
- **Growth**: Monitor new cases added per day
- **Usage**: Track which cases are most referenced
- **Quality**: Review cases periodically for data quality

---

**Note**: This system improves over time as more cases are added. The more cases in the knowledge base, the better the AI becomes at analyzing similar cases.

