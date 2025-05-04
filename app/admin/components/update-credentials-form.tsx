"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { createHash } from 'crypto'

// دالة تشفير كلمة المرور المطابقة لدالة hashPassword في lib/auth.ts
const hashPassword = (password: string): string => {
  return createHash('sha256')
    .update(password)
    .digest('hex')
};

export function UpdateCredentialsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentAdmin, setCurrentAdmin] = useState<string>("")
  const [adminList, setAdminList] = useState<string[]>([])
  const [formData, setFormData] = useState({
    currentEmail: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  // تحميل بريد المسؤول الحالي من localStorage وقائمة المسؤولين عند تحميل الصفحة
  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail")
    if (adminEmail) {
      setCurrentAdmin(adminEmail)
      setFormData(prev => ({ ...prev, currentEmail: adminEmail }))
    }
    
    // تحميل قائمة المسؤولين من Firestore
    const loadAdmins = async () => {
      try {
        const adminsCollection = collection(db, "admins")
        const snapshot = await getDocs(adminsCollection)
        const admins = snapshot.docs.map(doc => doc.id)
        setAdminList(admins)
        console.log("Available admins:", admins)
      } catch (err) {
        console.error("Error loading admins:", err)
      }
    }
    
    loadAdmins()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    if (!formData.currentEmail || !formData.currentPassword) {
      setError("Current email and password are required")
      setIsLoading(false)
      return
    }

    if (!formData.newEmail && !formData.newPassword) {
      setError("Please provide either a new email or password")
      setIsLoading(false)
      return
    }

    try {
      console.log("Checking admin with email:", formData.currentEmail)
      console.log("Admin list from state:", adminList)
      
      // البريد الإلكتروني الدقيق الذي سيتم استخدامه للبحث
      const emailToSearch = formData.currentEmail.trim()
      console.log("Trimmed email to search:", emailToSearch)
      
      // التحقق من وجود المستخدم في قائمة المسؤولين المخزنة
      const adminExists = adminList.some(admin => 
        admin.toLowerCase() === emailToSearch.toLowerCase()
      )
      
      console.log("Admin exists in state list:", adminExists)
      
      if (!adminExists) {
        // قم بتحديث القائمة مرة أخرى للتأكد
        const adminsCollection = collection(db, "admins")
        const snapshot = await getDocs(adminsCollection)
        
        console.log("Firestore admins:")
        snapshot.forEach(doc => {
          console.log(`- Admin ID: "${doc.id}", Data:`, doc.data())
        })
        
        const adminIDs = snapshot.docs.map(doc => doc.id)
        console.log("All admin IDs:", adminIDs)
        
        // البحث عن المسؤول باستخدام تطابق حالة الأحرف
        const exactMatch = adminIDs.find(id => id === emailToSearch)
        console.log("Exact match:", exactMatch)
        
        // البحث عن المسؤول بغض النظر عن حالة الأحرف
        const caseInsensitiveMatch = adminIDs.find(
          id => id.toLowerCase() === emailToSearch.toLowerCase()
        )
        console.log("Case insensitive match:", caseInsensitiveMatch)
        
        if (!exactMatch && !caseInsensitiveMatch) {
          console.error("Admin not found in collection")
          setError("Admin not found in the database")
          setIsLoading(false)
          return
        }
        
        // استخدام المعرف المطابق إذا تم العثور عليه
        if (exactMatch || caseInsensitiveMatch) {
          const matchedID = exactMatch || caseInsensitiveMatch || '';
          console.log("Using matched admin ID:", matchedID);
          
          // تحديث formData باستخدام المعرف المطابق
          setFormData(prev => ({ ...prev, currentEmail: matchedID }));
        }
      }
      
      // تحقق من وجود المستخدم الحالي
      const adminDocRef = doc(db, "admins", emailToSearch)
      const adminDoc = await getDoc(adminDocRef)
      
      if (!adminDoc.exists()) {
        console.error("Admin document does not exist:", emailToSearch)
        setError("Admin document not found")
        setIsLoading(false)
        return
      }

      const adminData = adminDoc.data()
      console.log("Admin data:", adminData)
      
      // تحقق من كلمة المرور الحالية
      const hashedCurrentPassword = hashPassword(formData.currentPassword)
      console.log("Current password hash:", hashedCurrentPassword)
      console.log("Stored password hash:", adminData.password)
      
      if (hashedCurrentPassword !== adminData.password) {
        setError("Current password is incorrect")
        setIsLoading(false)
        return
      }

      // إعداد بيانات التحديث
      const updateData: any = {}
      
      // تحديث كلمة المرور إذا تم توفيرها
      if (formData.newPassword) {
        updateData.password = hashPassword(formData.newPassword)
      }
      
      // تحديث البريد الإلكتروني إذا تم توفيره
      if (formData.newEmail) {
        // التحقق أولاً إذا كان البريد الإلكتروني الجديد مستخدم بالفعل
        const newEmailDoc = await getDoc(doc(db, "admins", formData.newEmail))
        if (newEmailDoc.exists()) {
          setError("Email already in use")
          setIsLoading(false)
          return
        }
      }

      // إذا كان هناك تغيير في البريد الإلكتروني
      if (formData.newEmail) {
        // تحديث البيانات بإضافة البريد الإلكتروني الجديد
        updateData.email = formData.newEmail
        
        // إنشاء مستند جديد باستخدام البريد الإلكتروني الجديد كمعرف
        const newAdminDocRef = doc(db, "admins", formData.newEmail)
        
        // نسخ بيانات المستند القديم والتحديثات إلى المستند الجديد
        await setDoc(newAdminDocRef, {
          ...adminData,
          ...updateData,
          email: formData.newEmail,
          updatedAt: new Date().toISOString()
        })
        
        // حذف المستند القديم
        await deleteDoc(doc(db, "admins", emailToSearch))
        
        // تحديث localStorage بالبريد الإلكتروني الجديد
        localStorage.setItem("adminEmail", formData.newEmail)
        
        // تحديث حالة البريد الإلكتروني الحالي
        setCurrentAdmin(formData.newEmail)
        
        // تحديث قائمة المسؤولين في الحالة
        setAdminList(prevList => {
          const newList = prevList.filter(admin => admin !== emailToSearch);
          return [...newList, formData.newEmail];
        });
      } else {
        // تحديث المستند الحالي فقط
        await updateDoc(doc(db, "admins", emailToSearch), {
          ...updateData,
          updatedAt: new Date().toISOString()
        })
      }

      setSuccess("Credentials updated successfully")
      setFormData({
        currentEmail: formData.newEmail || emailToSearch, // Use new email if updated
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentEmail" className="text-gray-200">Current Email</Label>
          <Input
            id="currentEmail"
            name="currentEmail"
            type="email"
            value={formData.currentEmail}
            onChange={handleChange}
            required
            className="bg-[#2a2b35] border-gray-700 text-white placeholder-gray-400"
          />
          {adminList.length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Available admins: {adminList.join(', ')}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newEmail" className="text-gray-200">New Email (Optional)</Label>
          <Input
            id="newEmail"
            name="newEmail"
            type="email"
            value={formData.newEmail}
            onChange={handleChange}
            className="bg-[#2a2b35] border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-gray-200">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="bg-[#2a2b35] border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-gray-200">New Password (Optional)</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="bg-[#2a2b35] border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {formData.newPassword && (
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword" className="text-gray-200">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required={!!formData.newPassword}
              className="bg-[#2a2b35] border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 text-green-400 border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Credentials"}
      </Button>
    </form>
  )
} 