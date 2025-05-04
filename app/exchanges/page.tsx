import { Suspense } from "react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeData } from "@/app/types"

export default async function ExchangesPage() {
  try {
    // Fetch exchanges from Firestore
    const exchangesSnapshot = await getDocs(collection(db, "exchanges"))
    const exchanges = exchangesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExchangeData[]

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">بورصات العملات المشفرة</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.map((exchange) => (
            <Link key={exchange.id} href={`/exchanges/${exchange.id}`}>
              <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden h-full">
                <div className="p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    {exchange.imageUrl && (
                      <img 
                        src={exchange.imageUrl} 
                        alt={exchange.name} 
                        className="w-12 h-12 rounded-lg mr-4 object-contain"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-bold">{exchange.name}</h2>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < exchange.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400 mr-2">({exchange.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full mr-2 font-medium ${
                      exchange.islamicRating === 'Halal' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : exchange.islamicRating === 'Controversial' 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {exchange.islamicRating}
                    </span>
                    <span className="text-sm text-gray-400">{exchange.coins} عملة</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{exchange.shortDescription}</p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-700/50 rounded p-2">
                      <span className="text-gray-400 block">الرسوم</span>
                      <span className="font-medium">{exchange.fees}</span>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <span className="text-gray-400 block">الحد الأدنى للإيداع</span>
                      <span className="font-medium">{exchange.minimumDeposit}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-3 text-center">
                  <span className="text-blue-400 font-medium">عرض التفاصيل والمراجعات</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching exchanges:", error)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">خطأ</h2>
          <p>فشل في تحميل بيانات البورصات</p>
        </div>
      </div>
    )
  }
} 