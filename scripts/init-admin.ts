import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import bcrypt from "bcrypt"

async function initializeAdmin() {
  try {
    // Default admin credentials - CHANGE THESE IN PRODUCTION
    const adminUsername = "admin"
    const adminPassword = "admin123" // You should change this password

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Create admin document
    await setDoc(doc(db, "admins", adminUsername), {
      username: adminUsername,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    })

    console.log("Admin user created successfully!")
    console.log("Username:", adminUsername)
    console.log("Password:", adminPassword)
    console.log("\nPlease change these credentials in production!")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

initializeAdmin() 