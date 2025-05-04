import Link from "next/link"
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeNews } from "@/app/types"
import { ArrowLeft, Calendar, Globe, Share2, Clock, Tag } from "lucide-react"

// هذه الوظيفة ضرورية لإنشاء صفحات ثابتة لكل معرف (id)
export async function generateStaticParams() {
  try {
    const newsSnapshot = await getDocs(collection(db, "news"))
    return newsSnapshot.docs.map(doc => ({
      id: doc.id
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// دالة لجلب خبر محدد
async function getNewsItem(id: string) {
  try {
    const newsDoc = await getDoc(doc(db, "news", id))
    
    if (!newsDoc.exists()) {
      return null
    }
    
    return {
      id: newsDoc.id,
      ...newsDoc.data(),
      publishedAt: newsDoc.data().publishedAt instanceof Date 
        ? newsDoc.data().publishedAt 
        : new Date(newsDoc.data().publishedAt)
    } as ExchangeNews
  } catch (error) {
    console.error("Error fetching news:", error)
    return null
  }
}

// دالة لجلب أخبار ذات صلة
async function getRelatedNews(currentNewsId: string, category?: string) {
  try {
    let newsQuery;
    
    if (category) {
      // إذا كان هناك تصنيف، نجلب الأخبار من نفس التصنيف
      newsQuery = query(
        collection(db, "news"),
        where("category", "==", category),
        where("id", "!=", currentNewsId),
        orderBy("publishedAt", "desc"),
        limit(3)
      )
    } else {
      // وإلا نجلب أحدث الأخبار
      newsQuery = query(
        collection(db, "news"),
        where("id", "!=", currentNewsId),
        orderBy("publishedAt", "desc"),
        limit(3)
      )
    }
    
    const newsSnapshot = await getDocs(newsQuery)
    
    const news = newsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt instanceof Date 
        ? doc.data().publishedAt 
        : new Date(doc.data().publishedAt)
    })) as ExchangeNews[]
    
    return news
  } catch (error) {
    console.error("Error fetching related news:", error)
    
    // في حالة حدوث خطأ، نحاول استعلامًا أبسط
    try {
      const simpleQuery = query(
        collection(db, "news"),
        orderBy("publishedAt", "desc"),
        limit(3)
      )
      
      const newsSnapshot = await getDocs(simpleQuery)
      
      return newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt instanceof Date 
          ? doc.data().publishedAt 
          : new Date(doc.data().publishedAt)
      })) as ExchangeNews[]
    } catch {
      return []
    }
  }
}

// دالة لتنسيق التاريخ بالعربية
function formatArabicDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('ar-EG', options).format(date)
}

// دالة لتنسيق الوقت بالعربية
function formatArabicTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Intl.DateTimeFormat('ar-EG', options).format(date)
}

export default async function NewsDetails({ params }: { params: { id: string } }) {
  const newsItem = await getNewsItem(params.id)
  const relatedNews = await getRelatedNews(params.id, newsItem?.category)
  
  if (!newsItem) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-400">لم يتم العثور على الخبر</h1>
        <p className="text-gray-400 mb-8">
          الخبر الذي تحاول الوصول إليه غير موجود أو تم حذفه.
        </p>
        <Link href="/news" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 justify-center">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى الأخبار</span>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/news" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى الأخبار</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* رأس الخبر */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            {newsItem.category && (
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-4">
                {newsItem.category}
              </div>
            )}
            
            <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatArabicDate(newsItem.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatArabicTime(newsItem.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{newsItem.source}</span>
              </div>
            </div>
            
            {/* صورة الخبر */}
            {newsItem.imageUrl && (
              <div className="w-full rounded-xl overflow-hidden mb-6">
                <img 
                  src={newsItem.imageUrl} 
                  alt={newsItem.title}
                  className="w-full object-cover"
                />
              </div>
            )}
            
            {/* محتوى الخبر */}
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {newsItem.content}
            </div>
            
            {/* زر المشاركة */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg px-4 py-2 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>مشاركة الخبر</span>
              </button>
            </div>
          </div>
          
          {/* المصدر الأصلي */}
          {newsItem.url && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 text-center">
              <p className="text-gray-300 mb-4">
                لقراءة الخبر من المصدر الأصلي، يمكنك زيارة الرابط التالي:
              </p>
              <a 
                href={newsItem.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                الانتقال إلى المصدر
              </a>
            </div>
          )}
        </div>
        
        {/* الجانب الأيمن - أخبار ذات صلة */}
        <div className="space-y-6">
          {/* أخبار ذات صلة */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">أخبار ذات صلة</h2>
            
            <div className="space-y-4">
              {relatedNews.length > 0 ? (
                relatedNews.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="block group">
                    <div className="flex gap-3">
                      {item.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatArabicDate(item.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">لا توجد أخبار ذات صلة</p>
              )}
            </div>
          </div>
          
          {/* تصنيفات الأخبار */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">تصنيفات الأخبار</h2>
            
            <div className="flex flex-wrap gap-2">
              <Link href="/news?category=bitcoin" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                بيتكوين
              </Link>
              <Link href="/news?category=ethereum" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                إيثريوم
              </Link>
              <Link href="/news?category=altcoins" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                العملات البديلة
              </Link>
              <Link href="/news?category=exchanges" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                منصات التداول
              </Link>
              <Link href="/news?category=regulations" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                التنظيمات
              </Link>
              <Link href="/news?category=defi" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                التمويل اللامركزي
              </Link>
              <Link href="/news?category=nft" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors">
                NFT
              </Link>
            </div>
          </div>
          
          {/* نصائح استثمارية */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Tag className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">نصيحة استثمارية</h3>
                <p className="text-gray-300 text-sm">
                  المعلومات الواردة في هذا الخبر هي للأغراض الإعلامية فقط ولا تشكل نصيحة استثمارية. يرجى إجراء البحث الخاص بك قبل اتخاذ أي قرارات استثمارية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 