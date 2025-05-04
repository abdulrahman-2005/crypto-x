"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FuturisticExchangeCardProps {
  id: string
  name: string
  rating: number
  islamicRating: "Halal" | "Haram" | "Controversial"
  fees: string
  coins: number
  imageUrl: string
  minimumDeposit?: string
  tradingPlatforms?: string[]
  licensesRegulations?: string[]
  paymentMethods?: string[]
  customerSupport?: string
}

export default function FuturisticExchangeCard({
  id,
  name,
  rating,
  islamicRating,
  fees,
  coins,
  imageUrl,
  minimumDeposit,
  tradingPlatforms = [],
  licensesRegulations = [],
  paymentMethods = [],
  customerSupport = "",
}: FuturisticExchangeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getRatingColor = (rating: "Halal" | "Haram" | "Controversial") => {
    switch (rating) {
      case "Halal":
        return "green"
      case "Haram":
        return "red"
      case "Controversial":
        return "yellow"
    }
  }

  const color = getRatingColor(islamicRating)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <div
        className="relative h-full group overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? `0 0 20px 0 ${color === "green" ? "rgba(74, 222, 128, 0.3)" : color === "red" ? "rgba(248, 113, 113, 0.3)" : "rgba(250, 204, 21, 0.3)"}`
            : "0 0 0 0 rgba(0, 0, 0, 0)",
        }}
      >
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            color === "green" ? "bg-green-500/10" : color === "red" ? "bg-red-500/10" : "bg-yellow-500/10"
          }`}
        />

        {/* Top corner accent */}
        <div
          className={`absolute -top-10 -right-10 w-20 h-20 rotate-45 transform ${
            color === "green" ? "bg-green-500/20" : color === "red" ? "bg-red-500/20" : "bg-yellow-500/20"
          }`}
        />
        {/* Bottom corner accent */}
        <div
          className={`absolute -bottom-10 -left-10 w-20 h-20 rotate-45 transform ${
            color === "green" ? "bg-green-500/20" : color === "red" ? "bg-red-500/20" : "bg-yellow-500/20"
          }`}
        />

        {/* Content */}
        <div className="relative p-6 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
                  color === "green" ? "bg-green-500/20" : color === "red" ? "bg-red-500/20" : "bg-yellow-500/20"
                }`}
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 2, ease: "linear", repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
              >
                <Image
                  src={imageUrl || "/placeholder.svg?height=40&width=40"}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div
                  className={`absolute inset-0 rounded-xl border ${
                    color === "green" ? "border-green-500/50" : color === "red" ? "border-red-500/50" : "border-yellow-500/50"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">{name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= Math.floor(rating) ? "text-yellow-500" : "text-gray-600"}`}
                        fill={star <= Math.floor(rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-400">{rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{fees}</div>
              <div className="text-sm text-gray-400">Trading Fee</div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <div className="text-sm text-gray-400">Available Coins</div>
              <div className="font-semibold">{coins}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Islamic Rating</div>
              <div className={`font-semibold ${
                islamicRating === "Halal"
                  ? "text-green-400"
                  : islamicRating === "Controversial"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}>
                {islamicRating}
              </div>
            </div>
          </div>

          <div className="mt-6">
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
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                {minimumDeposit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Minimum Deposit</span>
                    <span className="font-medium">{minimumDeposit}</span>
                  </div>
                )}
                {tradingPlatforms.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trading Platforms</span>
                    <span className="font-medium">{tradingPlatforms.join(", ")}</span>
                  </div>
                )}
                {licensesRegulations.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Licenses</span>
                    <span className="font-medium">{licensesRegulations.join(", ")}</span>
                  </div>
                )}
                {paymentMethods.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment Methods</span>
                    <span className="font-medium">{paymentMethods.join(", ")}</span>
                  </div>
                )}
                {customerSupport && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Customer Support</span>
                    <span className="font-medium">{customerSupport}</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-6">
            <Link href={`/reviews/${id}`} passHref>
              <Button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                Read Review <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
