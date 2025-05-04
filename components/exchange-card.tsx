"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExchangeCardProps {
  name: string
  rating: number
  islamicRating: "Halal" | "Haram" | "Controversial"
  fees: string
  coins: number
  imageUrl: string
}

export default function ExchangeCard({ name, rating, islamicRating, fees, coins, imageUrl }: ExchangeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="bg-[#0a0a1a]/60 border-gray-800 backdrop-blur-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{name}</h3>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.floor(rating) ? "text-yellow-500" : "text-gray-600"}`}
                      fill={star <= Math.floor(rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Islamic Ruling</span>
              <span
                className={`font-medium ${
                  islamicRating === "Halal"
                    ? "text-green-400"
                    : islamicRating === "Controversial"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {islamicRating}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trading Fees</span>
              <span className="font-medium">{fees}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Supported Coins</span>
              <span className="font-medium">{coins}+</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-[#0a0a1a] border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              Read Review
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800/50">
              Try Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
