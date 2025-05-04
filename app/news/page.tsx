import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeNews } from "@/app/types"
import { fetchCryptoNews, categorizeNews } from "@/lib/news-api"
import NewsPageClient from "@/components/news-page-client"

// دالة لجلب الأخبار من مصادر متعددة
async function getNews() {
  try {
    // جلب الأخبار من Firebase أولاً (الأخبار المخصصة)
    const localNewsQuery = query(
      collection(db, "news"),
      orderBy("publishedAt", "desc"),
      limit(10)
    )
    
    const localNewsSnapshot = await getDocs(localNewsQuery)
    
    const localNews = localNewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt instanceof Timestamp 
        ? doc.data().publishedAt.toDate() 
        : new Date(doc.data().publishedAt),
      isLocal: true // علامة للتمييز بين الأخبار المحلية والخارجية
    })) as (ExchangeNews & { isLocal?: boolean })[]
    
    // جلب الأخبار من API الخارجي
    const externalNews = await fetchCryptoNews(20);
    const markedExternalNews = externalNews.map(news => ({
      ...news,
      isLocal: false
    }));
    
    // دمج الأخبار وترتيبها حسب التاريخ
    const allNews = [...localNews, ...markedExternalNews].sort((a, b) => 
      b.publishedAt.getTime() - a.publishedAt.getTime()
    );
    
    return {
      news: allNews,
      categories: categorizeNews(allNews),
      totalCount: allNews.length,
      localCount: localNews.length,
      externalCount: externalNews.length
    };
  } catch (error) {
    console.error("Error fetching news:", error)
    return {
      news: [],
      categories: {},
      totalCount: 0,
      localCount: 0,
      externalCount: 0
    }
  }
}

// دالة لتنسيق التاريخ بالعربية
function formatArabicDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Intl.DateTimeFormat('ar-EG', options).format(date)
}

// استخراج معلمات URL
type NewsPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { news: allNews, categories, totalCount, localCount, externalCount } = await getNews()
  
  // فلترة الأخبار حسب الفئة إذا تم تحديدها
  const categoryFilter = searchParams?.category;
  const filteredNews = categoryFilter && categories[categoryFilter] 
    ? categories[categoryFilter] 
    : allNews;
  
  // استخراج أخبار البيتكوين للعرض العاجل
  const bitcoinNews = categories.bitcoin || []
  const urgentNews = bitcoinNews.length > 0 
    ? bitcoinNews.slice(0, 5) 
    : allNews.slice(0, 5);
  
  return (
    <NewsPageClient 
      categoryFilter={categoryFilter} 
      filteredNews={filteredNews} 
      categories={categories} 
      totalCount={totalCount} 
      localCount={localCount} 
      externalCount={externalCount}
      urgentNews={urgentNews}
    />
  )
}
