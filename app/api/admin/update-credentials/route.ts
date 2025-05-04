import { NextResponse } from "next/server"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"

const firebaseConfig = {
  apiKey: "AIzaSyDfvX9sowkfrRotS5z08xDwmk29aZAwVjs",
  authDomain: "newcrypto-4e3f0.firebaseapp.com",
  projectId: "newcrypto-4e3f0",
  storageBucket: "newcrypto-4e3f0.firebasestorage.app",
  messagingSenderId: "760268557632",
  appId: "1:760268557632:web:aaf7954d47df6096c9fea5"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const isAuthenticated = cookieStore.get("isAdminAuthenticated")?.value === "true"
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in again" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentEmail, newEmail, currentPassword, newPassword } = body

    // Get current admin document
    const adminDoc = await getDoc(doc(db, "admins", currentEmail))
    if (!adminDoc.exists()) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    const adminData = adminDoc.data()
    
    // Verify current password
    const hashedCurrentPassword = hashPassword(currentPassword)
    if (hashedCurrentPassword !== adminData.password) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: { username?: string; password?: string } = {}
    
    if (newEmail) {
      // Check if new email already exists
      const newEmailDoc = await getDoc(doc(db, "admins", newEmail))
      if (newEmailDoc.exists()) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
      updateData.username = newEmail
    }

    if (newPassword) {
      updateData.password = hashPassword(newPassword)
    }

    // If email is being updated, we need to:
    // 1. Create new document with new email
    // 2. Delete old document
    if (newEmail) {
      // Create new document with new email
      await updateDoc(doc(db, "admins", newEmail), {
        ...adminData,
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      
      // Delete old document
      await updateDoc(doc(db, "admins", currentEmail), {
        deleted: true,
        deletedAt: new Date().toISOString()
      })
    } else {
      // Just update the existing document
      await updateDoc(doc(db, "admins", currentEmail), {
        ...updateData,
        updatedAt: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { message: "Credentials updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update credentials" },
      { status: 500 }
    )
  }
} 