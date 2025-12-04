/**
 * Case Service - Handles saving and retrieving cases from Firestore
 */

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save a case analysis to Firestore
 */
export async function saveCase(userId, caseData) {
  try {
    console.log("🔵 saveCase called:", { userId, hasAnalysis: !!caseData.analysis });
    
    // Safely convert deadline to Timestamp
    let deadlineTimestamp = null;
    if (caseData.deadline) {
      try {
        const deadlineDate = new Date(caseData.deadline);
        // Check if date is valid
        if (!isNaN(deadlineDate.getTime())) {
          deadlineTimestamp = Timestamp.fromDate(deadlineDate);
        } else {
          console.warn("⚠️ Invalid deadline date, skipping:", caseData.deadline);
        }
      } catch (error) {
        console.warn("⚠️ Error converting deadline, skipping:", error);
      }
    }
    
    const caseDoc = {
      userId,
      description: caseData.description || "",
      analysis: caseData.analysis,
      status: caseData.status || "active", // active, archived, resolved
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deadline: deadlineTimestamp,
      tags: caseData.tags || [],
      notes: caseData.notes || "",
    };

    console.log("🔵 Attempting to add document to 'cases' collection...");
    const docRef = await addDoc(collection(db, "cases"), caseDoc);
    console.log("✅ Document added to cases:", docRef.id);
    
    // Update user's cases array
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const cases = userData.cases || [];
      await updateDoc(userRef, {
        cases: [...cases, docRef.id],
      });
      console.log("✅ Updated user's cases array");
    } else {
      console.warn("⚠️ User document doesn't exist, skipping cases array update");
    }

    return { success: true, caseId: docRef.id };
  } catch (error) {
    console.error("❌ Error saving case:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message, code: error.code };
  }
}

/**
 * Get all cases for a user
 */
export async function getUserCases(userId) {
  try {
    const q = query(
      collection(db, "cases"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const cases = [];
    
    querySnapshot.forEach((doc) => {
      cases.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        deadline: doc.data().deadline?.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate(),
      });
    });
    
    return { success: true, cases };
  } catch (error) {
    console.error("Error getting user cases:", error);
    return { success: false, error: error.message, cases: [] };
  }
}

/**
 * Get a single case by ID
 */
export async function getCase(caseId) {
  try {
    const caseDoc = await getDoc(doc(db, "cases", caseId));
    
    if (!caseDoc.exists()) {
      return { success: false, error: "Case not found" };
    }
    
    const caseData = {
      id: caseDoc.id,
      ...caseDoc.data(),
      createdAt: caseDoc.data().createdAt?.toDate(),
      updatedAt: caseDoc.data().updatedAt?.toDate(),
      deadline: caseDoc.data().deadline?.toDate(),
      resolvedAt: caseDoc.data().resolvedAt?.toDate(),
    };
    
    return { success: true, case: caseData };
  } catch (error) {
    console.error("Error getting case:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a case
 */
export async function updateCase(caseId, updates) {
  try {
    const caseRef = doc(db, "cases", caseId);
    
    // Convert resolvedAt to Timestamp if it's a Date
    const updateData = { ...updates };
    if (updates.resolvedAt) {
      if (updates.resolvedAt instanceof Date) {
        updateData.resolvedAt = Timestamp.fromDate(updates.resolvedAt);
      } else if (typeof updates.resolvedAt === 'string') {
        updateData.resolvedAt = Timestamp.fromDate(new Date(updates.resolvedAt));
      }
    }
    
    await updateDoc(caseRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating case:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a case
 */
export async function deleteCase(caseId, userId) {
  try {
    await deleteDoc(doc(db, "cases", caseId));
    
    // Remove from user's cases array
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const cases = (userData.cases || []).filter((id) => id !== caseId);
      await updateDoc(userRef, { cases });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting case:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get cases with upcoming deadlines
 */
export async function getCasesWithDeadlines(userId, daysAhead = 30) {
  try {
    const { cases } = await getUserCases(userId);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);
    
    const casesWithDeadlines = cases.filter((caseItem) => {
      if (!caseItem.deadline) return false;
      const deadline = caseItem.deadline;
      return deadline >= now && deadline <= futureDate;
    });
    
    return { success: true, cases: casesWithDeadlines };
  } catch (error) {
    console.error("Error getting cases with deadlines:", error);
    return { success: false, error: error.message, cases: [] };
  }
}

