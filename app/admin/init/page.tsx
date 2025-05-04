"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { hashPassword } from "@/lib/auth"

export default function InitAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [existingAdmins, setExistingAdmins] = useState<string[]>([])

  // Check for existing admins when the page loads
  useEffect(() => {
    async function checkExistingAdmins() {
      try {
        const adminsCollection = collection(db, "admins")
        const snapshot = await getDocs(adminsCollection)
        const admins = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setExistingAdmins(admins.map(admin => admin.id))
      } catch (error) {
        console.error("Error checking admins:", error)
      }
    }
    checkExistingAdmins()
  }, [])

  const initializeAdmin = async () => {
    try {
      setIsLoading(true)
      setMessage("")
      setError("")

      // Admin credentials
      const adminUsername = "ahmedma12w@gmail.com"
      const adminPassword = "123456"

      console.log("Creating admin user:", adminUsername)

      // First check if admin collection exists
      const adminsCollection = collection(db, "admins")
      const snapshot = await getDocs(adminsCollection)
      console.log("Current admins in database:", snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))

      // Hash the password
      const hashedPassword = hashPassword(adminPassword)
      console.log("Generated hash:", hashedPassword)

      // Create admin document
      const adminRef = doc(db, "admins", adminUsername)
      await setDoc(adminRef, {
        username: adminUsername,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      })

      // Verify the user was created
      const userDoc = await getDoc(adminRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        console.log("Stored user data:", {
          username: userData.username,
          hashedPassword: userData.password,
          createdAt: userData.createdAt
        })
        
        // Verify the hash matches
        const verifyHash = hashPassword(adminPassword)
        console.log("Hash verification:", {
          original: hashedPassword,
          verification: verifyHash,
          matches: hashedPassword === verifyHash
        })

        // Check if we can read it back
        const checkDoc = await getDoc(adminRef)
        if (checkDoc.exists()) {
          console.log("Successfully read back admin data:", checkDoc.data())
        } else {
          console.error("Failed to read back admin data!")
        }
      }

      setMessage(`Admin user created successfully!
Username: ${adminUsername}
Password: ${adminPassword}
Hash: ${hashedPassword}

Please save these credentials!

Current admins in database: ${existingAdmins.join(", ")}`)
    } catch (error: any) {
      console.error("Error creating admin user:", error)
      setError(`Failed to create admin user: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Initialize Admin User</h1>
        
        {existingAdmins.length > 0 && (
          <div className="p-4 bg-blue-900/20 border border-blue-900 rounded-lg mb-4">
            <h2 className="font-semibold mb-2">Existing Admins:</h2>
            <ul className="list-disc list-inside">
              {existingAdmins.map(admin => (
                <li key={admin}>{admin}</li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={initializeAdmin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          {isLoading ? "Creating Admin..." : "Create Admin User"}
        </Button>

        {message && (
          <pre className="p-4 bg-green-900/20 border border-green-900 rounded-lg whitespace-pre-wrap">
            {message}
          </pre>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 