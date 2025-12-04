/**
 * Document Service - Handles document uploads and management with Firebase Storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { storage } from "./firebase";
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
 * Upload a document to Firebase Storage and save metadata to Firestore
 */
export async function uploadDocument(userId, caseId, file, metadata = {}) {
  try {
    // Create storage reference
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `cases/${userId}/${caseId}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save metadata to Firestore
    const docData = {
      userId,
      caseId,
      fileName: file.name,
      storagePath: snapshot.ref.fullPath,
      downloadURL,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: Timestamp.now(),
      ...metadata,
    };
    
    const docRef = await addDoc(collection(db, "documents"), docData);
    
    return {
      success: true,
      documentId: docRef.id,
      downloadURL,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all documents for a case
 */
export async function getCaseDocuments(caseId) {
  try {
    const q = query(
      collection(db, "documents"),
      where("caseId", "==", caseId),
      orderBy("uploadedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      });
    });
    
    return { success: true, documents };
  } catch (error) {
    console.error("Error getting case documents:", error);
    return { success: false, error: error.message, documents: [] };
  }
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId) {
  try {
    const q = query(
      collection(db, "documents"),
      where("userId", "==", userId),
      orderBy("uploadedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      });
    });
    
    return { success: true, documents };
  } catch (error) {
    console.error("Error getting user documents:", error);
    return { success: false, error: error.message, documents: [] };
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId) {
  try {
    // Get document metadata
    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }
    
    const docData = docSnap.data();
    
    // Delete from Storage
    const storageRef = ref(storage, docData.storagePath);
    await deleteObject(storageRef);
    
    // Delete from Firestore
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get document download URL
 */
export async function getDocumentURL(documentId) {
  try {
    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }
    
    return { success: true, downloadURL: docSnap.data().downloadURL };
  } catch (error) {
    console.error("Error getting document URL:", error);
    return { success: false, error: error.message };
  }
}

