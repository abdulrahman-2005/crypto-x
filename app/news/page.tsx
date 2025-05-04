"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ExchangeNews } from "@/app/types"
import { fetchCryptoNews, categorizeNews } from "@/lib/news-api"
import NewsPageClient from "@/components/news-page-client"

// Default data for static generation
const defaultNewsData = {
  news: [],
  categories: {},
  totalCount: 0,
  localCount: 0,
  externalCount: 0
}

export default function NewsPage() {
  const [newsData, setNewsData] = useState(defaultNewsData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
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
          isLocal: true
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
        
        setNewsData({
          news: allNews,
          categories: categorizeNews(allNews),
          totalCount: allNews.length,
          localCount: localNews.length,
          externalCount: externalNews.length
        });
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NewsPageClient 
      categoryFilter={null}
      filteredNews={newsData.news}
      categories={newsData.categories}
      totalCount={newsData.totalCount}
      localCount={newsData.localCount}
      externalCount={newsData.externalCount}
      urgentNews={newsData.news.slice(0, 5)}
    />
  )
}
