"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ExchangeData } from "@/app/types"
import { MessageSquare, Star, TrendingUp, Users, ArrowLeft, Shield } from "lucide-react"

type ReviewsPageClientProps = {
  exchanges: (ExchangeData & { reviewCount: number })[];
  totalReviews: number;
}

export default function ReviewsPageClient({ exchanges, totalReviews }: ReviewsPageClientProps) {
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
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Exchange Ratings & Reviews
          </motion.h1>
          <Link href="/" className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full transition-all duration-300 border border-yellow-500/30">
            <span>Back to Home</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      
        <motion.div 
          className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 mb-10 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-yellow-300">Real User Opinions</h2>
              <p className="text-gray-200 max-w-2xl leading-relaxed">
                Read real user experiences with cryptocurrency trading platforms. Share your own experience and help others choose the right platform for their needs.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div 
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl px-5 py-4 flex items-center gap-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,85,247,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
                  <Users className="text-purple-400 h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{exchanges.length}</div>
                  <div className="text-sm text-purple-200">Exchanges</div>
                </div>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-xl px-5 py-4 flex items-center gap-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                  <MessageSquare className="text-blue-400 h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{totalReviews}</div>
                  <div className="text-sm text-blue-200">{totalReviews === 1 ? "Review" : "Reviews"}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.map((exchange, index) => (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index % 6) * 0.1 }}
            >
              <Link 
                href={`/reviews/${exchange.id}`}
                className="group block h-full"
              >
                <div className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-yellow-500/20 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] group-hover:border-yellow-500/40 group-hover:translate-y-[-5px]">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center gap-4 mb-5">
                      {exchange.imageUrl && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/30 flex items-center justify-center p-1 group-hover:border-yellow-500/50 transition-all duration-300">
                          <img 
                            src={exchange.imageUrl} 
                            alt={exchange.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">{exchange.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < exchange.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-yellow-200/80">{exchange.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center bg-gray-800/30 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 text-sm">Islamic Rating</span>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          exchange.islamicRating === 'Halal' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : exchange.islamicRating === 'Controversial' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {exchange.islamicRating}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-gray-800/30 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 text-sm">Review Count</span>
                        </div>
                        <span className="font-medium text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                          {exchange.reviewCount}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">{exchange.shortDescription}</p>
                  </div>
                  
                  <div className="mt-auto bg-gradient-to-r from-yellow-600/20 to-amber-600/20 p-4 group-hover:from-yellow-600/30 group-hover:to-amber-600/30 transition-all duration-300 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-yellow-300 font-medium">Read Reviews</span>
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
