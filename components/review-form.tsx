import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { Review } from "@/types/review"

interface ReviewFormProps {
  type: "cryptocurrency" | "exchange"
  id: string
}

export function ReviewForm({ type, id }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      const review: Review = {
        id: Date.now().toString(),
        userId: "current-user-id", // سيتم تحديثه لاحقاً
        userName: "Current User", // سيتم تحديثه لاحقاً
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      }

      const docRef = doc(db, type, id)
      await updateDoc(docRef, {
        reviews: arrayUnion(review),
      })

      setComment("")
      setRating(5)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
} 