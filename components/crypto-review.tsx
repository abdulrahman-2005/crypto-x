"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Crypto {
  id: string
  name: string
  symbol: string
  price: string
  change: string
  rating: number
  imageUrl: string
  chartData: number[]
  trend: "up" | "down"
  islamicRating: "Halal" | "Controversial" | "Haram"
  shortDescription: string
  fullContent: string
  pros: string[]
  cons: string[]
  shariaRuling: "Halal" | "Controversial" | "Haram"
  rulingReason: string
}

interface CryptoReviewProps {
  crypto: Crypto
}

export default function CryptoReview({ crypto }: CryptoReviewProps) {
  const router = useRouter()

  const getRatingColor = (rating: "Halal" | "Controversial" | "Haram") => {
    switch (rating) {
      case "Halal":
        return "green"
      case "Haram":
        return "red"
      case "Controversial":
        return "yellow"
    }
  }

  const color = getRatingColor(crypto.islamicRating)

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => router.back()} 
        className="mb-8 bg-black border border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </span>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${
                  color === "green" ? "bg-green-500/20" : color === "red" ? "bg-red-500/20" : "bg-yellow-500/20"
                }`}>
                  <Image
                    src={crypto.imageUrl}
                    alt={crypto.name}
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                  <div className={`absolute inset-0 rounded-2xl border ${
                    color === "green" ? "border-green-500/50" : color === "red" ? "border-red-500/50" : "border-yellow-500/50"
                  }`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{crypto.name}</h1>
                  <p className="text-gray-400">{crypto.symbol}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{crypto.shortDescription}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Full Review</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{crypto.fullContent}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Pros</h3>
                    <ul className="space-y-3">
                      {crypto.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Cons</h3>
                    <ul className="space-y-3">
                      {crypto.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-red-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Sharia Ruling</h3>
                  <div className={`rounded-xl p-6 ${
                    color === "green" ? "bg-green-500/10 border border-green-500/20" :
                    color === "red" ? "bg-red-500/10 border border-red-500/20" :
                    "bg-yellow-500/10 border border-yellow-500/20"
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        color === "green" ? "bg-green-500/20" :
                        color === "red" ? "bg-red-500/20" :
                        "bg-yellow-500/20"
                      }`}>
                        {color === "green" ? (
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : color === "red" ? (
                          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-lg font-semibold ${
                        color === "green" ? "text-green-400" :
                        color === "red" ? "text-red-400" :
                        "text-yellow-400"
                      }`}>
                        {crypto.shariaRuling}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{crypto.rulingReason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Market Data</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">Current Price</p>
                <p className="text-2xl font-bold">${crypto.price}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">24h Change</p>
                <p className={`text-xl font-bold ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.change}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Rating</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${star <= Math.floor(crypto.rating) ? "text-yellow-400" : "text-gray-600"}`}
                      fill={star <= Math.floor(crypto.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Islamic Rating</p>
                <p className={`text-xl font-bold ${
                  color === "green" ? "text-green-400" :
                  color === "red" ? "text-red-400" :
                  "text-yellow-400"
                }`}>
                  {crypto.islamicRating}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 