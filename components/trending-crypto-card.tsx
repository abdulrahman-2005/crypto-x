"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, ChevronUp, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TrendingCryptoCardProps {
  name: string
  symbol: string
  price: string
  change: string
  rating: number
  imageUrl: string
  chartData: number[]
  trend: "up" | "down"
}

export default function TrendingCryptoCard({
  name,
  symbol,
  price,
  change,
  rating,
  imageUrl,
  chartData,
  trend,
}: TrendingCryptoCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="bg-[#0a0a1a]/60 border-gray-800 backdrop-blur-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold">{name}</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">{symbol}</span>
                  <div className="ml-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= Math.floor(rating) ? "text-yellow-500" : "text-gray-600"}`}
                        fill={star <= Math.floor(rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{price}</div>
              <div
                className={`text-sm font-medium flex items-center justify-end ${trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                {trend === "up" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {change}
              </div>
            </div>
          </div>

          <div className="mt-4 h-16">
            <div className="flex items-end justify-between h-full gap-0.5">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className={`w-full ${trend === "up" ? "bg-green-500/20" : "bg-red-500/20"} rounded-sm`}
                  style={{
                    height: `${value}%`,
                    backgroundColor:
                      trend === "up"
                        ? `rgba(34, 197, 94, ${0.2 + (index / chartData.length) * 0.8})`
                        : `rgba(239, 68, 68, ${0.2 + (index / chartData.length) * 0.8})`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>Details</span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="font-medium">${(Math.random() * 1000).toFixed(2)}B</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="font-medium">${(Math.random() * 100).toFixed(2)}B</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Islamic Ruling</span>
                  <span
                    className={`font-medium ${
                      name === "Bitcoin" || name === "Solana"
                        ? "text-green-400"
                        : name === "Ethereum"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {name === "Bitcoin" || name === "Solana"
                      ? "Halal"
                      : name === "Ethereum"
                        ? "Controversial"
                        : "Haram"}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <Button className="w-full mt-4 bg-[#0a0a1a] border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-white transition-all duration-300">
            Read Review <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
