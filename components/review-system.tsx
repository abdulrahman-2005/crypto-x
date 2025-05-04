'use client'

import { useState, useEffect, useRef } from 'react'
import { UserReview } from '@/app/types'
import { collection, getDocs, addDoc, query, where, limit, getCountFromServer, doc, getDocs as getDocsOnce } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Star, MessageSquare, ChevronDown, Loader2 } from 'lucide-react'

// Simple mock for authentication until real auth is implemented
const useAuth = () => {
  // Return a mock user - in a real app, this would check authentication state
  return {
    user: {
      uid: 'anonymous-user',
      displayName: 'زائر'
    }
  }
}

interface ReviewSystemProps {
  exchangeId: string
}

// دالة لتنسيق التاريخ بشكل آمن
function formatDateTime(date: Date | string | number | any) {
  try {
    // تحويل القيمة إلى كائن Date إذا لم تكن كذلك بالفعل
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }
    
    // التحقق من صلاحية التاريخ
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "تاريخ غير معروف";
    }
    
    // تنسيق التاريخ بالعربية
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // استخدام اللغة العربية للتنسيق
    return new Intl.DateTimeFormat('ar', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "تاريخ غير معروف";
  }
}

export default function ReviewSystem({ exchangeId }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const [userName, setUserName] = useState('زائر')
  const [totalReviews, setTotalReviews] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [allReviews, setAllReviews] = useState<UserReview[]>([])
  const PAGE_SIZE = 5 // عدد التعليقات في كل تحميل

  // دالة لتحديث عدد المراجعات
  const updateReviewCount = async () => {
    try {
      const countQuery = query(
        collection(db, 'reviews'),
        where('exchangeId', '==', exchangeId)
      )
      const countSnapshot = await getCountFromServer(countQuery)
      const count = countSnapshot.data().count
      setTotalReviews(count)
      return count
    } catch (error) {
      console.error('Error updating review count:', error)
      return null
    }
  }

  // تحميل التعليقات الأولية
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        
        // استخدام استعلام بسيط بدون orderBy لتجنب الحاجة إلى فهرس مركب
        const simpleQuery = query(
          collection(db, 'reviews'),
          where('exchangeId', '==', exchangeId)
        )
        
        // الحصول على العدد الإجمالي
        const count = await updateReviewCount()
        
        // جلب جميع المراجعات لهذا التبادل
        const reviewsSnapshot = await getDocs(simpleQuery)
        let reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserReview[]
        
        // فرز البيانات محليًا بدلاً من استخدام orderBy
        reviewsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
          return dateB.getTime() - dateA.getTime() // ترتيب تنازلي
        })
        
        // حفظ جميع المراجعات لاستخدامها في التحميل المتتالي
        setAllReviews(reviewsData)
        
        // عرض أول مجموعة فقط
        setReviews(reviewsData.slice(0, PAGE_SIZE))
        setHasMore(reviewsData.length > PAGE_SIZE)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [exchangeId])

  // تحميل المزيد من التعليقات - الآن يعمل فقط على البيانات المخزنة محليًا
  const loadMoreReviews = () => {
    if (!hasMore || loadingMore) return
    
    try {
      setLoadingMore(true)
      
      const currentLength = reviews.length
      const nextBatch = allReviews.slice(currentLength, currentLength + PAGE_SIZE)
      
      if (nextBatch.length > 0) {
        setReviews([...reviews, ...nextBatch])
        setHasMore(currentLength + nextBatch.length < allReviews.length)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more reviews:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSubmitting(true)
      const review: Omit<UserReview, 'id'> = {
        exchangeId,
        userId: user.uid,
        userName: userName || 'زائر',
        rating: newRating,
        comment: newComment,
        createdAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'reviews'), review)
      
      // Reset form
      setNewRating(5)
      setNewComment('')
      
      // إضافة المراجعة الجديدة إلى القائمة في الأعلى
      const newReview = {
        id: docRef.id,
        ...review
      }
      
      // تحديث قائمة كل المراجعات
      setAllReviews([newReview, ...allReviews])
      
      // تحديث قائمة المراجعات المعروضة
      setReviews([newReview, ...reviews.slice(0, PAGE_SIZE - 1)])
      
      // تحديث العدد الإجمالي للتعليقات من خلال الاستعلام المباشر من Firebase
      // هذا يضمن دقة العداد حتى إذا أضاف مستخدمون آخرون مراجعات في نفس الوقت
      await updateReviewCount()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('حدث خطأ أثناء إرسال المراجعة. يرجى المحاولة مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">التقييمات والمراجعات</h2>
        <span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">
          {totalReviews} {totalReviews === 1 ? "تعليق" : "تعليقات"}
        </span>
      </div>
      
      {user ? (
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="space-y-2">
            <label className="text-lg font-medium">الاسم:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              placeholder="أدخل اسمك"
              required
            />
          </div>
        
          <div className="flex items-center gap-2">
            <label className="text-lg font-medium">التقييم:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} ⭐
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-lg font-medium">تعليقك:</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              rows={4}
              placeholder="أضف رأيك وتجربتك مع هذه البورصة..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الإرسال...</span>
              </div>
            ) : "إرسال المراجعة"}
          </button>
        </form>
      ) : (
        <p className="text-gray-400">يرجى تسجيل الدخول لإضافة مراجعة</p>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.userName || "زائر"}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDateTime(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* زر تحميل المزيد */}
            {hasMore && (
              <div 
                ref={loadMoreRef}
                className="text-center pt-4"
              >
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري التحميل...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>عرض المزيد من التعليقات</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-500 mb-2" />
            <p className="text-gray-400">لا توجد مراجعات بعد. كن أول من يضيف مراجعة!</p>
          </div>
        )}
      </div>
    </div>
  )
}