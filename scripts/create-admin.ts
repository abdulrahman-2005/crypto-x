import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import bcrypt from "bcrypt"

async function createAdmin() {
  try {
    const username = "admin" // Change this to your desired username
    const password = "admin123" // Change this to your desired password
    
    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Add admin user to Firestore
    await setDoc(doc(db, "admins", username), {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    })

    console.log("Admin user created successfully!")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdmin() 