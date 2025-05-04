import { collection, getDocs, query, where, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeData } from "@/app/types"
import ReviewsPageClient from "@/components/reviews-page-client"

async function getExchanges() {
  try {
    const exchangesSnapshot = await getDocs(collection(db, "exchanges"))
    const exchanges = exchangesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      reviewCount: 0 // سيتم تحديثه لاحقًا
    })) as (ExchangeData & { reviewCount: number })[]
    
    // جلب عدد المراجعات لكل منصة تبادل
    for (const exchange of exchanges) {
      const reviewCountQuery = query(
        collection(db, "reviews"),
        where("exchangeId", "==", exchange.id)
      )
      const countSnapshot = await getCountFromServer(reviewCountQuery)
      exchange.reviewCount = countSnapshot.data().count
    }
    
    return exchanges
  } catch (error) {
    console.error("Error fetching exchanges:", error)
    return []
  }
}

export default async function ReviewsPage() {
  const exchanges = await getExchanges()
  
  // حساب إجمالي عدد المراجعات
  const totalReviews = exchanges.reduce((total, exchange) => total + exchange.reviewCount, 0)
  
  return (
    <ReviewsPageClient 
      exchanges={exchanges}
      totalReviews={totalReviews}
    />
  )
}