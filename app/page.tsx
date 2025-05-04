"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, ChevronUp, Star, TrendingUp, Zap, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CryptoChart from "@/components/crypto-chart"
import FuturisticCryptoCard from "@/components/futuristic-crypto-card"
import FuturisticExchangeCard from "@/components/futuristic-exchange-card"
import HeroBackground from "@/components/hero-background"
import HeroIcon from "@/components/hero-icon"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CryptoData, ExchangeData } from "@/app/types"
import Link from "next/link"

function HeroSection({ cryptoPrice }: { cryptoPrice: { btc: number; eth: number; sol: number } }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <HeroBackground />

      <div className="container mx-auto px-4 z-10 relative pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y }}
          >
            {/* Live price ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 flex items-center space-x-6 overflow-hidden"
            >
              <div className="flex items-center space-x-2 text-sm bg-white/5 backdrop-blur-lg px-3 py-1.5 rounded-full border border-purple-500/20">
                <span className="text-purple-400">BTC</span>
                <span className="text-green-400">${cryptoPrice.btc.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-white/5 backdrop-blur-lg px-3 py-1.5 rounded-full border border-cyan-500/20">
                <span className="text-cyan-400">ETH</span>
                <span className="text-green-400">${cryptoPrice.eth.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-white/5 backdrop-blur-lg px-3 py-1.5 rounded-full border border-blue-500/20">
                <span className="text-blue-400">SOL</span>
                <span className="text-green-400">${cryptoPrice.sol.toFixed(2)}</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="block">Discover the</span>
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 px-2"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Future of Crypto
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 max-w-2xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Unbiased analysis of cryptocurrencies and exchanges with Islamic compliance ratings for the digital age
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { icon: <TrendingUp className="h-5 w-5 text-purple-400" />, text: "Real-time market data" },
                { icon: <Shield className="h-5 w-5 text-cyan-400" />, text: "Islamic compliance ratings" },
                { icon: <Zap className="h-5 w-5 text-emerald-400" />, text: "Expert analysis" },
                { icon: <Globe className="h-5 w-5 text-blue-400" />, text: "Global exchange reviews" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-lg p-3 rounded-xl border border-gray-800/50"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(139, 92, 246, 0.5)",
                  }}
                >
                  {feature.icon}
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button 
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-purple-500/20 relative overflow-hidden group"
                onClick={() => {
                  const section = document.getElementById('trending-cryptocurrencies');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 flex items-center">
                  Trending Cryptocurrencies
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </Button>

              <Button
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-full px-8 py-6 text-lg relative overflow-hidden group"
                onClick={() => {
                  const section = document.getElementById('top-exchanges');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Top Exchanges</span>
                <motion.div
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>

            {/* Trusted by section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-12"
            >
              <p className="text-sm text-gray-400 mb-3">Trusted by crypto enthusiasts worldwide</p>
              <div className="flex flex-wrap items-center gap-6">
                <motion.div
                  className="h-10 px-4 bg-white/10 rounded-md backdrop-blur-sm flex items-center justify-center border border-purple-500/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.5)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold">C</div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">CryptoSphere</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="h-10 px-4 bg-white/10 rounded-md backdrop-blur-sm flex items-center justify-center border border-green-500/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-xs font-bold">B</div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">BlockVenture</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="h-10 px-4 bg-white/10 rounded-md backdrop-blur-sm flex items-center justify-center border border-amber-500/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(245, 158, 11, 0.5)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center text-xs font-bold">S</div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">SatoshiTrust</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="h-10 px-4 bg-white/10 rounded-md backdrop-blur-sm flex items-center justify-center border border-pink-500/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(236, 72, 153, 0.5)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-xs font-bold">D</div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300">DefiNexus</span>
                  </div>
                </motion.div>
                

              </div>
            </motion.div>
          </motion.div>

          {/* Right column - 3D visualization */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ y }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 border border-purple-500/20 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 border border-cyan-500/20 rounded-full" />

            {/* Stats cards */}
            <motion.div
              className="absolute -top-10 right-10 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-purple-500/30 z-20 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Market Cap</div>
                  <div className="font-bold text-white">$1.82T</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 left-10 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30 z-20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">24h Volume</div>
                  <div className="font-bold text-white">$78.5B</div>
                </div>
              </div>
            </motion.div>

            {/* Main 3D scene */}
            <div className="relative z-10 bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
              <div className="relative h-64 flex items-center justify-center">
                <HeroIcon />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 text-purple-400" />
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  const [showMore, setShowMore] = useState(false)
  const [showMoreCrypto, setShowMoreCrypto] = useState(false)
  const [cryptoSearch, setCryptoSearch] = useState("")
  const [exchangeSearch, setExchangeSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const [cryptoPrice, setCryptoPrice] = useState({ btc: 43567.89, eth: 3245.67, sol: 98.76 })
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [exchanges, setExchanges] = useState<ExchangeData[]>([])
  const [loading, setLoading] = useState(true)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Filter cryptos based on search
  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(cryptoSearch.toLowerCase())
  )

  // Filter exchanges based on search
  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(exchangeSearch.toLowerCase())
  )

  useEffect(() => {
    setMounted(true)

    // Fetch data from Firebase
    const fetchData = async () => {
      try {
        const cryptosSnapshot = await getDocs(collection(db, "cryptos"))
        const exchangesSnapshot = await getDocs(collection(db, "exchanges"))

        setCryptos(cryptosSnapshot.docs.map(doc => {
          const data = doc.data()
          // Ensure chartData is populated with random values if not present
          if (!data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0) {
            data.chartData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20)
          }
          return { id: doc.id, ...data } as CryptoData
        }))
        setExchanges(exchangesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExchangeData)))
      } catch (error) {
        // Removed all console.error statements for production
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Simulate price changes
    const interval = setInterval(() => {
      setCryptoPrice((prev: { btc: number; eth: number; sol: number }) => ({
        btc: prev.btc + (Math.random() - 0.5) * 100,
        eth: prev.eth + (Math.random() - 0.5) * 10,
        sol: prev.sol + (Math.random() - 0.5) * 5,
      }))
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!mounted || loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-hidden">
      <HeroSection cryptoPrice={cryptoPrice} />

      <motion.div 
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        >
          Welcome to Crypto Review
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* مقارنة الأسعار */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/compare" className="group block h-full">
              <div className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-blue-500/40 hover:translate-y-[-5px]">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <svg className="w-10 h-10 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center text-blue-300 group-hover:text-blue-200 transition-colors duration-300">Price Comparison</h2>
                <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300">Compare cryptocurrency prices across different exchanges and find the best deals</p>
              </div>
            </Link>
          </motion.div>

          {/* التقييمات والمراجعات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/reviews" className="group block h-full">
              <div className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.2)] h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:border-yellow-500/40 hover:translate-y-[-5px]">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/30 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-amber-500/20"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <svg className="w-10 h-10 text-yellow-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">Ratings & Reviews</h2>
                <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300">Read user reviews and share your experience with different exchanges</p>
              </div>
            </Link>
          </motion.div>

          {/* الأخبار والتحديثات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/news" className="group block h-full">
              <div className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)] h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:border-green-500/40 hover:translate-y-[-5px]">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-500/20"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <svg className="w-10 h-10 text-green-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center text-green-300 group-hover:text-green-200 transition-colors duration-300">News & Updates</h2>
                <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300">Stay informed with the latest news and updates in the world of cryptocurrency</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Trending Cryptocurrencies */}
        <section id="trending-cryptocurrencies" className="py-20 relative">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Cryptocurrencies</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Stay updated with the most popular cryptocurrencies and their latest performance metrics
              </p>
              
              {/* Search field for cryptocurrencies */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={cryptoSearch}
                    onChange={(e) => setCryptoSearch(e.target.value)}
                    placeholder="Search cryptocurrencies..."
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCryptos
                .slice(0, showMoreCrypto ? undefined : 6)
                .map((crypto) => (
                  <FuturisticCryptoCard
                    key={crypto.id}
                    id={crypto.id}
                    name={crypto.name}
                    symbol={crypto.symbol}
                    price={`$${Number(crypto.price).toLocaleString()}`}
                    change={typeof crypto.change === 'number' ? `${crypto.change > 0 ? '+' : ''}${crypto.change}%` : crypto.change}
                    rating={crypto.rating}
                    imageUrl={crypto.imageUrl}
                    chartData={crypto.chartData}
                    trend={crypto.trend}
                    overview={crypto.shortDescription}
                    islamicRating={crypto.shariaRuling}
                  />
              ))}
            </div>

            {filteredCryptos.length > 6 && (
              <div className="mt-10 text-center">
                <Button
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-full px-8"
                  onClick={() => setShowMoreCrypto(!showMoreCrypto)}
                >
                  {showMoreCrypto ? "Show Less" : "Show More"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Coins & Comparison */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Coins & Comparison</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Compare top cryptocurrencies side by side to make informed investment decisions
              </p>
            </div>

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-[#0a0a1a] border border-gray-800 rounded-full overflow-hidden">
                <TabsTrigger value="featured">Featured Coins</TabsTrigger>
                <TabsTrigger value="comparison">Comparison Chart</TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cryptos.slice(0, 4).map((coin) => (
                    <div
                      key={coin.id}
                      className="h-full relative group overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-300" />

                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{
                                rotate: 15,
                                scale: 1.15,
                                boxShadow: "0 8px 32px 0 rgba(139,92,246,0.25)"
                              }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"
                            >
                              <Image
                                src={coin.imageUrl || "/placeholder.svg?height=30&width=30"}
                                alt={coin.name}
                                width={30}
                                height={30}
                                className="rounded-lg"
                              />
                            </motion.div>
                            <div>
                              <h3 className="font-bold">{coin.name}</h3>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</span>
                                <div className="ml-2 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${star <= 4 ? "text-yellow-500" : "text-gray-600"}`}
                                      fill={star <= 4 ? "currentColor" : "none"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${typeof coin.change === 'number' ? (coin.change > 0 ? 'text-green-400' : 'text-red-400') : ''}`}
                            >
                              {typeof coin.change === 'number' ? (coin.change > 0 ? '+' : '') : ''}{coin.change}%
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Islamic Ruling</span>
                            <span
                              className={`font-medium ${
                                coin.shariaRuling === "Halal"
                                  ? "text-green-400"
                                  : coin.shariaRuling === "Controversial"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {coin.shariaRuling === "Halal"
                                ? "Halal"
                                : coin.shariaRuling === "Controversial"
                                ? "Controversial"
                                : "Haram"}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Market Cap</span>
                            <span className="font-medium">${(Math.random() * 1000).toFixed(2)}B</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">24h Volume</span>
                            <span className="font-medium">${(Math.random() * 100).toFixed(2)}B</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                <div className="bg-[#0a0a1a]/60 border border-gray-800 backdrop-blur-lg rounded-xl p-6 overflow-x-auto">
                  <CryptoChart />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Top Crypto Exchanges */}
        <section id="top-exchanges" className="py-20 relative">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Crypto Exchanges</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Find the best cryptocurrency exchanges with detailed reviews and Islamic compliance ratings
              </p>

              {/* Search field for exchanges */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={exchangeSearch}
                    onChange={(e) => setExchangeSearch(e.target.value)}
                    placeholder="Search exchanges..."
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExchanges
                .slice(0, showMore ? undefined : 6)
                .map((exchange) => (
                  <FuturisticExchangeCard
                    key={exchange.id}
                    id={exchange.id}
                    name={exchange.name}
                    rating={exchange.rating}
                    islamicRating={exchange.islamicRating}
                    fees={exchange.fees}
                    coins={exchange.coins}
                    imageUrl={exchange.imageUrl}
                    minimumDeposit={exchange.minimumDeposit}
                    tradingPlatforms={exchange.tradingPlatforms}
                    licensesRegulations={exchange.licensesRegulations}
                    paymentMethods={exchange.paymentMethods}
                    customerSupport={exchange.customerSupport}
                  />
              ))}
            </div>

            {filteredExchanges.length > 6 && (
              <div className="mt-10 text-center">
                <Button
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-full px-8"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  )
}
