import { Suspense } from "react"
import { notFound } from "next/navigation"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ExchangeReview from "@/components/exchange-review"
import ReviewSystem from "@/components/review-system"
import { ExchangeData } from "@/app/types"

interface PageProps {
  params: {
    id: string
  }
}

// This function is required for static exports with dynamic routes
export async function generateStaticParams() {
  try {
    // Fetch all exchange IDs from Firestore
    const exchangesSnapshot = await getDocs(collection(db, "exchanges"))
    const exchangeIds = exchangesSnapshot.docs.map((doc) => ({
      id: doc.id,
    }))

    console.log(`Generated static params for ${exchangeIds.length} exchanges`)
    
    return exchangeIds
  } catch (error) {
    console.error("Error generating static params for exchanges:", error)
    // Return at least one entry to prevent build errors
    return [{ id: "binance" }, { id: "coinbase" }, { id: "kraken" }]
  }
}

export default async function Page({ params }: PageProps) {
  const exchangeId = params.id
  
  try {
    // Fetch exchange data server-side
    const exchangeDoc = await getDoc(doc(db, "exchanges", exchangeId))
    
    if (!exchangeDoc.exists()) {
      return notFound()
    }
    
    const data = exchangeDoc.data()
    const exchangeData: ExchangeData = {
      id: exchangeId,
      ...data,
      pros: Array.isArray(data.pros) ? data.pros : [],
      cons: Array.isArray(data.cons) ? data.cons : [],
      tradingPlatforms: Array.isArray(data.tradingPlatforms) ? data.tradingPlatforms : [],
      licensesRegulations: Array.isArray(data.licensesRegulations) ? data.licensesRegulations : [],
      paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
      rating: typeof data.rating === 'number' ? data.rating : 0,
      coins: typeof data.coins === 'number' ? data.coins : 0
    } as ExchangeData
    
    return (
      <div className="space-y-8">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      }>
        <ExchangeReview exchange={exchangeData} />
      </Suspense>

        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          }>
            <ReviewSystem exchangeId={exchangeId} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching exchange:", error)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Failed to load exchange data</p>
        </div>
      </div>
    )
  }
} 