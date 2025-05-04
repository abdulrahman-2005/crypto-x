"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { NewspaperIcon, ArrowLeft, CalendarIcon, TrendingUp, Bitcoin, Database, Rss, Globe } from "lucide-react"
import { ExchangeNews } from "@/app/types"

// Function to format date in English
function formatEnglishDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

// Helper function for category names
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    altcoins: 'Altcoins',
    defi: 'DeFi',
    nft: 'NFT',
    regulations: 'Regulations',
    exchanges: 'Exchanges',
    general: 'General'
  };
  
  return categoryMap[category] || category;
}

type NewsPageClientProps = {
  categoryFilter?: string;
  filteredNews: (ExchangeNews & { isLocal?: boolean })[];
  categories: Record<string, (ExchangeNews & { isLocal?: boolean })[]>;
  totalCount: number;
  localCount: number;
  externalCount: number;
  urgentNews: (ExchangeNews & { isLocal?: boolean })[];
}

export default function NewsPageClient({ 
  categoryFilter, 
  filteredNews, 
  categories, 
  totalCount, 
  localCount, 
  externalCount,
  urgentNews
}: NewsPageClientProps) {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-10">
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {categoryFilter 
              ? `${getCategoryName(categoryFilter)} - Cryptocurrency News`
              : 'Latest Cryptocurrency News'
            }
          </motion.h1>
          <Link href="/" className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 rounded-full transition-all duration-300 border border-green-500/30">
            <span>Back to Home</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 mb-10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-300">Exclusive News & Instant Updates</h2>
              <p className="text-gray-200 max-w-2xl leading-relaxed">
                Follow the latest developments and news in the world of cryptocurrencies and blockchain, with instant updates on the most important market events.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 flex flex-col items-center shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30 mb-2">
                  <NewspaperIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{totalCount}</div>
                  <div className="text-sm text-blue-200">News Articles</div>
                </div>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-5 flex flex-col items-center shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(234,179,8,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30 mb-2">
                  <Bitcoin className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{categories.bitcoin?.length || 0}</div>
                  <div className="text-sm text-yellow-200">Bitcoin News</div>
                </div>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 flex flex-col items-center shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,85,247,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30 mb-2">
                  <Database className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{localCount}</div>
                  <div className="text-sm text-purple-200">Exclusive News</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Breaking news ticker */}
        <motion.div 
          className="relative overflow-hidden mb-10 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-red-500/90 px-4 py-1.5 text-white font-bold absolute top-0 right-0 z-10 rounded-bl-lg">
            BREAKING
          </div>
          <div className="px-6 py-4 overflow-hidden whitespace-nowrap">
            <motion.div 
              className="animate-marquee inline-flex items-center"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {urgentNews.map((item, index) => (
                <span key={item.id} className="mx-4 text-red-100">
                  {index > 0 ? ' • ' : ''}
                  {item.title}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
        
        {/* News categories */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link 
              href="/news" 
              className={`px-4 py-2 ${!categoryFilter ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-gray-800/60 text-gray-300 border-gray-700'} hover:bg-green-500/30 rounded-full text-sm transition-all duration-300 border flex items-center gap-2`}
            >
              <Globe className="h-4 w-4" />
              <span>All ({totalCount})</span>
            </Link>
          </motion.div>
          {Object.entries(categories).map(([category, items], index) => (
            items.length > 0 && (
              <motion.div 
                key={category}
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${0.3 + (index * 0.05)}s` }}
              >
                <Link 
                  href={`/news?category=${category}`} 
                  className={`px-4 py-2 ${categoryFilter === category ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-gray-800/60 text-gray-300 border-gray-700'} hover:bg-green-500/30 rounded-full text-sm transition-all duration-300 border flex items-center gap-2`}
                >
                  <Rss className="h-4 w-4" />
                  <span>{getCategoryName(category)} ({items.length})</span>
                </Link>
              </motion.div>
            )
          ))}
        </motion.div>
        
        {/* Main news section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${0.4 + (index % 6) * 0.1}s` }}
              >
                <Link 
                  href={item.isLocal ? `/news/${item.id}` : item.url}
                  target={item.isLocal ? "_self" : "_blank"}
                  className="group block h-full"
                >
                  <div className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col shadow-[0_0_15px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] group-hover:border-green-500/40 group-hover:translate-y-[-5px]">
                    {item.imageUrl && (
                      <div className="w-full h-48 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.isLocal && (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                            <Database className="h-3 w-3" />
                            <span>Exclusive</span>
                          </div>
                        )}
                        
                        {item.category && (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                            <Rss className="h-3 w-3" />
                            <span>
                              {typeof item.category === 'string' 
                                ? getCategoryName(item.category)
                                : Array.isArray(item.category) 
                                  ? item.category[0]
                                  : 'General'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-green-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
                        <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-1 rounded-full">
                          <CalendarIcon className="h-4 w-4 text-green-400" />
                          <span>{formatEnglishDate(item.publishedAt)}</span>
                        </div>
                        <div className="text-gray-300 bg-gray-800/30 px-3 py-1 rounded-full">{item.source}</div>
                      </div>
                    </div>
                    
                    <div className="mt-auto bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 group-hover:from-green-600/30 group-hover:to-emerald-600/30 transition-all duration-300 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-green-300 font-medium">Read More</span>
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-3 text-center py-16 bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <NewspaperIcon className="h-20 w-20 text-gray-500 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-300 mb-3">No News in This Category</h3>
              <p className="text-gray-400 max-w-md mx-auto">Try selecting another category or return to the main list.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
