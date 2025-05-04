import { Suspense } from "react"
import Link from "next/link"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeData } from "@/app/types"
import { MessageSquare, Star, ArrowLeft, Shield, Zap, Globe } from "lucide-react"
import ReviewSystem from "@/components/review-system"

// هذه الوظيفة ضرورية لإنشاء صفحات ثابتة لكل معرف (id) عند استخدام output: export
export async function generateStaticParams() {
  try {
    const exchangesSnapshot = await getDocs(collection(db, "exchanges"))
    return exchangesSnapshot.docs.map(doc => ({
      id: doc.id
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

async function getExchange(id: string) {
  try {
    const exchangeDoc = await getDoc(doc(db, "exchanges", id))
    
    if (!exchangeDoc.exists()) {
      return null
    }
    
    return {
      id: exchangeDoc.id,
      ...exchangeDoc.data()
    } as ExchangeData
  } catch (error) {
    console.error("Error fetching exchange:", error)
    return null
  }
}

export default async function ExchangeDetails({ params }: { params: { id: string } }) {
  const exchange = await getExchange(params.id)
  
  if (!exchange) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-400">لم يتم العثور على البورصة</h1>
        <p className="text-gray-400 mb-8">
          البورصة التي تحاول الوصول إليها غير موجودة أو تم حذفها.
        </p>
        <Link href="/reviews" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 justify-center">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى التقييمات</span>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/reviews" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى التقييمات</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Right column - Exchange details */}
        <div className="md:col-span-2 space-y-8">
          {/* Header section with basic info */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <div className="flex items-start gap-6">
              {exchange.imageUrl && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={exchange.imageUrl} 
                    alt={exchange.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{exchange.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < exchange.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">
                    {exchange.rating.toFixed(1)} من أصل 5
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    exchange.islamicRating === 'Halal' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : exchange.islamicRating === 'Controversial' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    التصنيف الإسلامي: {exchange.islamicRating}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300">
                    الرسوم: {exchange.fees}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300">
                    العملات: {exchange.coins}+
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">نبذة عن البورصة</h2>
            <p className="text-gray-300 whitespace-pre-line">{exchange.fullContent}</p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">الترخيص والتنظيم</h3>
                  <ul className="space-y-2 text-gray-300">
                    {exchange.licensesRegulations?.map((license, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span>{license}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">منصات التداول</h3>
                  <ul className="space-y-2 text-gray-300">
                    {exchange.tradingPlatforms?.map((platform, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span>{platform}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">وسائل الدفع</h3>
                  <ul className="space-y-2 text-gray-300">
                    {exchange.paymentMethods?.map((method, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">خدمة العملاء</h3>
                  <p className="text-gray-300">{exchange.customerSupport}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">المميزات</h3>
              <ul className="space-y-2">
                {exchange.pros?.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 font-bold mt-0.5">+</span>
                    <span className="text-gray-300">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">العيوب</h3>
              <ul className="space-y-2">
                {exchange.cons?.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold mt-0.5">-</span>
                    <span className="text-gray-300">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Islamic Ruling Explanation */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">التصنيف الإسلامي</h2>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full mb-4 ${
              exchange.islamicRating === 'Halal' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : exchange.islamicRating === 'Controversial' 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <span className="font-medium">{exchange.islamicRating}</span>
            </div>
            
            <p className="text-gray-300">{exchange.rulingReason}</p>
          </div>
        </div>
        
        {/* Left column - Reviews only, removed News */}
        <div>
          {/* Reviews section */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <Suspense fallback={
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/3"></div>
              </div>
            }>
              <ReviewSystem exchangeId={params.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
} 