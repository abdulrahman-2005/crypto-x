import { NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { cookies } from "next/headers"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Parse and log request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to parse request body" },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const { username, password } = body

    // Hash the provided password
    const hashedPassword = hashPassword(password)

    // Get the user document
    const userDoc = await getDoc(doc(db, "admins", username))
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const userData = userDoc.data()
    
    // Validate password hash exists
    if (!userData.password) {
      return NextResponse.json(
        { error: "Invalid user data" },
        { status: 500 }
      )
    }

    // Compare password hashes
    const isValidPassword = hashedPassword === userData.password
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create successful response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    // Set auth cookie
    response.cookies.set("isAdminAuthenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
} 