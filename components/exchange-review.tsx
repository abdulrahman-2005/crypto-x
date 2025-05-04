"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ExchangeData } from "@/app/types"

interface ExchangeReviewProps {
  exchange: ExchangeData
}

export default function ExchangeReview({ exchange }: ExchangeReviewProps) {
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

  const color = getRatingColor(exchange.islamicRating)

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
                    src={exchange.imageUrl}
                    alt={exchange.name}
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                  <div className={`absolute inset-0 rounded-2xl border ${
                    color === "green" ? "border-green-500/50" : color === "red" ? "border-red-500/50" : "border-yellow-500/50"
                  }`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{exchange.name}</h1>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{exchange.shortDescription}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Full Review</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{exchange.fullContent}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Pros</h3>
                    <ul className="space-y-3">
                      {exchange.pros.map((pro, index) => (
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
                      {exchange.cons.map((con, index) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Trading Platforms</h3>
                    <ul className="space-y-3">
                      {exchange.tradingPlatforms.map((platform, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-purple-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-300">{platform}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Payment Methods</h3>
                    <ul className="space-y-3">
                      {exchange.paymentMethods.map((method, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-cyan-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-gray-300">{method}</span>
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
                        {exchange.shariaRuling}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{exchange.rulingReason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Exchange Info</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">Trading Fee</p>
                <p className="text-2xl font-bold">{exchange.fees}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Available Coins</p>
                <p className="text-xl font-bold">{exchange.coins}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Rating</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${star <= Math.floor(exchange.rating) ? "text-yellow-400" : "text-gray-600"}`}
                      fill={star <= Math.floor(exchange.rating) ? "currentColor" : "none"}
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
                  {exchange.islamicRating}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Minimum Deposit</p>
                <p className="text-xl font-bold">{exchange.minimumDeposit}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Licenses & Regulations</h3>
            <ul className="space-y-3">
              {exchange.licensesRegulations.map((license, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-300">{license}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Customer Support</h3>
            <p className="text-gray-300 leading-relaxed">{exchange.customerSupport}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 