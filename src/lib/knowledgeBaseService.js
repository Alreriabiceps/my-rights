/**
 * Knowledge Base Service - Stores anonymized cases for AI learning
 * This collection stores all cases (without personal info) to help the AI learn from past cases
 */

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save a case to the knowledge base (anonymized, for AI learning)
 * This is separate from personal cases - it's a shared knowledge base
 */
export async function saveToKnowledgeBase(caseData) {
  try {
    console.log("🔵 saveToKnowledgeBase called:", { hasAnalysis: !!caseData.analysis });
    
    // Extract key information for learning (anonymized)
    const knowledgeDoc = {
      // Case characteristics
      caseType: caseData.analysis?.caseType || "Unknown",
      description: caseData.description || "", // User input (already anonymized)
      
      // Analysis results
      severity: caseData.analysis?.severity || {},
      relevantLaws: caseData.analysis?.relevantLaws || [],
      rights: caseData.analysis?.rights || [],
      essentialDocuments: caseData.analysis?.essentialDocuments || [],
      
      // Key features for similarity matching
      keywords: extractKeywords(caseData.description || ""),
      tags: caseData.analysis?.caseType ? [caseData.analysis.caseType] : [],
      
      // Metadata (no personal info)
      createdAt: Timestamp.now(),
      usageCount: 0, // Track how often this case is used for learning
      
      // For similarity search
      complexity: caseData.analysis?.severity?.complexity || 5,
      urgencyLevel: caseData.analysis?.riskAssessment?.urgencyLevel || "medium",
    };

    console.log("🔵 Attempting to add document to 'knowledgeBase' collection...");
    const docRef = await addDoc(collection(db, "knowledgeBase"), knowledgeDoc);
    console.log("✅ Document added to knowledgeBase:", docRef.id);
    return { success: true, knowledgeId: docRef.id };
  } catch (error) {
    console.error("❌ Error saving to knowledge base:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message, code: error.code };
  }
}

/**
 * Extract keywords from description for better matching
 */
function extractKeywords(description) {
  // Simple keyword extraction (can be enhanced with NLP)
  const commonWords = new Set([
    "ang", "ng", "sa", "at", "ay", "na", "mga", "ito", "ni", "si",
    "the", "a", "an", "is", "are", "was", "were", "to", "of", "in",
    "ko", "mo", "namin", "ninyo", "nila", "kami", "kayo", "sila",
    "para", "kung", "kapag", "dahil", "kaya", "pero", "at", "o",
    "ako", "ikaw", "siya", "tayo", "kami", "kayo", "sila"
  ]);
  
  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 20); // Top 20 keywords
    
  return words;
}

/**
 * Find similar cases from knowledge base
 * Used to provide context to AI when analyzing new cases
 */
export async function findSimilarCases(caseDescription, caseType = null, limitCount = 5) {
  try {
    let q;
    
    // Filter by case type if provided
    if (caseType) {
      q = query(
        collection(db, "knowledgeBase"),
        where("caseType", "==", caseType),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    } else {
      // Get recent cases for context
      q = query(
        collection(db, "knowledgeBase"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const similarCases = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      similarCases.push({
        id: doc.id,
        caseType: data.caseType,
        description: data.description,
        relevantLaws: data.relevantLaws || [],
        rights: data.rights || [],
        essentialDocuments: data.essentialDocuments || [],
        severity: data.severity || {},
        createdAt: data.createdAt?.toDate(),
      });
    });
    
    return { success: true, cases: similarCases };
  } catch (error) {
    console.error("Error finding similar cases:", error);
    // If query fails (e.g., no index), return empty array
    return { success: false, error: error.message, cases: [] };
  }
}

/**
 * Get cases by keywords for better matching
 */
export async function findCasesByKeywords(keywords, limitCount = 5) {
  try {
    // Get all cases and filter by keyword matching (Firestore doesn't support full-text search)
    const q = query(
      collection(db, "knowledgeBase"),
      orderBy("createdAt", "desc"),
      limit(50) // Get more to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    const matchingCases = [];
    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const caseKeywords = new Set((data.keywords || []).map(k => k.toLowerCase()));
      
      // Check if any keywords match
      const matches = keywords.some(k => caseKeywords.has(k.toLowerCase()));
      if (matches && matchingCases.length < limitCount) {
        matchingCases.push({
          id: doc.id,
          caseType: data.caseType,
          description: data.description,
          relevantLaws: data.relevantLaws || [],
          rights: data.rights || [],
          essentialDocuments: data.essentialDocuments || [],
          severity: data.severity || {},
          createdAt: data.createdAt?.toDate(),
        });
      }
    });
    
    return { success: true, cases: matchingCases };
  } catch (error) {
    console.error("Error finding cases by keywords:", error);
    return { success: false, error: error.message, cases: [] };
  }
}

/**
 * Find similar cases by analyzing the description and matching keywords
 */
export async function findSimilarCasesByDescription(description, limitCount = 3) {
  try {
    const keywords = extractKeywords(description);
    
    // First try to find by keywords
    if (keywords.length > 0) {
      const keywordResult = await findCasesByKeywords(keywords, limitCount);
      if (keywordResult.success && keywordResult.cases.length > 0) {
        return keywordResult;
      }
    }
    
    // Fallback to recent cases
    return await findSimilarCases(description, null, limitCount);
  } catch (error) {
    console.error("Error finding similar cases by description:", error);
    return { success: false, error: error.message, cases: [] };
  }
}

/**
 * Get all cases from knowledge base (for admin/analytics page)
 */
export async function getAllKnowledgeBaseCases(limitCount = 200) {
  try {
    const q = query(
      collection(db, "knowledgeBase"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const cases = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cases.push({
        id: doc.id,
        caseType: data.caseType,
        description: data.description,
        relevantLaws: data.relevantLaws || [],
        rights: data.rights || [],
        essentialDocuments: data.essentialDocuments || [],
        severity: data.severity || {},
        keywords: data.keywords || [],
        complexity: data.complexity || 5,
        urgencyLevel: data.urgencyLevel || "medium",
        usageCount: data.usageCount || 0,
        createdAt: data.createdAt?.toDate(),
      });
    });
    
    return { success: true, cases, total: cases.length };
  } catch (error) {
    console.error("Error getting all knowledge base cases:", error);
    return { success: false, error: error.message, cases: [], total: 0 };
  }
}

/**
 * Get knowledge base statistics
 */
export async function getKnowledgeBaseStats() {
  try {
    const { cases } = await getAllKnowledgeBaseCases(1000); // Get more for stats
    
    const stats = {
      totalCases: cases.length,
      byCaseType: {},
      byUrgency: {},
      averageComplexity: 0,
      totalUsageCount: 0,
    };
    
    let totalComplexity = 0;
    
    cases.forEach((caseItem) => {
      // Count by case type
      const caseType = caseItem.caseType || "Unknown";
      stats.byCaseType[caseType] = (stats.byCaseType[caseType] || 0) + 1;
      
      // Count by urgency
      const urgency = caseItem.urgencyLevel || "medium";
      stats.byUrgency[urgency] = (stats.byUrgency[urgency] || 0) + 1;
      
      // Sum complexity
      totalComplexity += caseItem.complexity || 5;
      
      // Sum usage count
      stats.totalUsageCount += caseItem.usageCount || 0;
    });
    
    stats.averageComplexity = cases.length > 0 
      ? parseFloat((totalComplexity / cases.length).toFixed(1))
      : 0;
    
    return { success: true, stats };
  } catch (error) {
    console.error("Error getting knowledge base stats:", error);
    return { success: false, error: error.message, stats: null };
  }
}

