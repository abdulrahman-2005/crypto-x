"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { createHash } from 'crypto'

// دالة تشفير كلمة المرور المطابقة لدالة hashPassword في lib/auth.ts
const hashPassword = (password: string): string => {
  return createHash('sha256')
    .update(password)
    .digest('hex')
};

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    console.log("Attempting to login...");

    try {
      // التحقق من قيم الإدخال
      if (!username.trim() || !password) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }
      
      // التحقق من وجود المستخدم في Firestore
      const userDoc = await getDoc(doc(db, "admins", username.trim()));
      
      if (!userDoc.exists()) {
        console.log("User not found");
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }
      
      const userData = userDoc.data();
      
      // التحقق من كلمة المرور باستخدام نفس الخوارزمية المستخدمة عند إنشاء الحساب
      const hashedPassword = hashPassword(password);
      console.log("Hashed password:", hashedPassword);
      console.log("Stored hashed password:", userData.password);
      
      if (!userData.password || userData.password !== hashedPassword) {
        console.log("Password incorrect");
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }
      
      console.log("Login successful");
      
      // تخزين حالة تسجيل الدخول في localStorage
      localStorage.setItem("isAdminAuthenticated", "true");
      localStorage.setItem("adminEmail", username.trim());
      
      // توجيه المستخدم إلى لوحة التحكم باستخدام replace بدلاً من push
      console.log("Redirecting to admin panel");
      router.replace("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred. Please try again later."
      )
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-black/20 backdrop-blur-lg rounded-lg border border-gray-800">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Admin Login
        </h1>
        <p className="text-gray-400 text-sm">
          Please sign in to access the admin dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">Email</Label>
          <Input
            id="username"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-black/20 border-gray-800"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black/20 border-gray-800"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
} 