"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FuturisticCryptoCardProps {
  id: string
  name: string
  symbol: string
  price: string
  change: string
  rating: number
  imageUrl: string
  chartData: number[]
  trend: "up" | "down"
  overview: string
  islamicRating: "Halal" | "Controversial" | "Haram"
}

export default function FuturisticCryptoCard({
  id,
  name,
  symbol,
  price,
  change,
  rating,
  imageUrl,
  chartData,
  trend,
  overview,
  islamicRating,
}: FuturisticCryptoCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
        className={`relative h-full group overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl transition-all duration-300`}
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

                {/* Animated border */}
                <div
                  className={`absolute inset-0 rounded-xl border ${
                    color === "green" ? "border-green-500/50" : color === "red" ? "border-red-500/50" : "border-yellow-500/50"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>

              <div>
                <h3 className="font-bold text-lg">{name}</h3>
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
              <div className="font-bold text-lg">{price}</div>
              <div
                className={`text-sm font-medium flex items-center justify-end ${
                  trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend === "up" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {change}
              </div>
            </div>
          </div>

          <div className="mt-6 h-16 relative">
            {/* Chart background glow */}
            <div
              className={`absolute inset-0 rounded-lg ${
                color === "green" ? "bg-green-500/5" : color === "red" ? "bg-red-500/5" : "bg-yellow-500/5"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="flex items-end justify-between h-full gap-0.5">
              {chartData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: "20%" }}
                  animate={{ height: `${Math.max(20, value)}%` }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className={`w-full min-h-[4px] rounded-sm relative overflow-hidden ${
                    color === "green" ? "bg-green-500/20" : color === "red" ? "bg-red-500/20" : "bg-yellow-500/20"
                  }`}
                >
                  <motion.div
                    className={`absolute inset-0 ${
                      color === "green"
                        ? "bg-gradient-to-t from-green-500/40 to-green-500/80"
                        : color === "red"
                        ? "bg-gradient-to-t from-red-500/40 to-red-500/80"
                        : "bg-gradient-to-t from-yellow-500/40 to-yellow-500/80"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className="mt-4 text-sm text-gray-400 line-clamp-2">
            {overview}
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
                transition={{ duration: 0.3 }}
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
              </motion.div>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              onClick={() => setExpanded(!expanded)}
              className={`w-full group relative overflow-hidden mb-3 ${
                color === "green"
                  ? "bg-black border border-green-500/50 text-green-400 hover:bg-green-500/20"
                  : color === "red"
                  ? "bg-black border border-red-500/50 text-red-400 hover:bg-red-500/20"
                  : "bg-black border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {expanded ? "Hide Stats" : "Quick Stats"}
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.div>
              </span>
            </Button>

            <Link href={`/cryptocurrencies/${id}`} passHref>
              <Button
                className={`w-full group relative overflow-hidden ${
                  color === "green"
                    ? "bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                    : color === "red"
                    ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                    : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Read Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </Link>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 grid grid-cols-2 gap-3"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`p-3 rounded-xl ${
                      color === "green"
                        ? "bg-green-500/10 border-green-500/30"
                        : color === "red"
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    } border`}
                  >
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="font-bold mt-1">${(Math.random() * 1000).toFixed(2)}B</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-3 rounded-xl ${
                      color === "green"
                        ? "bg-green-500/10 border-green-500/30"
                        : color === "red"
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    } border`}
                  >
                    <div className="text-sm text-gray-400">24h Volume</div>
                    <div className="font-bold mt-1">${(Math.random() * 100).toFixed(2)}B</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`p-3 rounded-xl ${
                      color === "green"
                        ? "bg-green-500/10 border-green-500/30"
                        : color === "red"
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    } border`}
                  >
                    <div className="text-sm text-gray-400">Islamic Rating</div>
                    <div className={`font-bold mt-1 ${
                      islamicRating === "Halal"
                        ? "text-green-400"
                        : islamicRating === "Controversial"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}>
                      {islamicRating}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`p-3 rounded-xl ${
                      color === "green"
                        ? "bg-green-500/10 border-green-500/30"
                        : color === "red"
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    } border`}
                  >
                    <div className="text-sm text-gray-400">Rating</div>
                    <div className="font-bold mt-1 flex items-center">
                      {rating.toFixed(1)}
                      <Star className="h-3 w-3 ml-1 text-yellow-500" fill="currentColor" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
