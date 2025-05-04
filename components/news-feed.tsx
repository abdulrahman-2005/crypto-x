'use client'

import { useState, useEffect } from 'react'
import { ExchangeNews } from '@/app/types'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface NewsFeedProps {
  exchangeId: string
}

export default function NewsFeed({ exchangeId }: NewsFeedProps) {
  const [news, setNews] = useState<ExchangeNews[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const newsQuery = query(
          collection(db, 'news'),
          orderBy('publishedAt', 'desc'),
          limit(5)
        )
        const newsSnapshot = await getDocs(newsQuery)
        const newsData = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ExchangeNews[]
        setNews(newsData)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [exchangeId])

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
      <h2 className="text-2xl font-bold">آخر الأخبار والتحديثات</h2>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-gray-300 mb-2">{item.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{item.source}</span>
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
              >
                اقرأ المزيد
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 