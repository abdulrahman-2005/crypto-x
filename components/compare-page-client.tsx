"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, AlertTriangle, ArrowLeft, BarChart2, RefreshCw, Globe } from "lucide-react"
import { ReactNode } from "react"

type ComparePageClientProps = {
  children: ReactNode;
}

export default function ComparePageClient({ children }: ComparePageClientProps) {
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
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Price Comparison
          </motion.h1>
          <Link href="/" className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full transition-all duration-300 border border-blue-500/30">
            <span>Back to Home</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      
        <motion.div 
          className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 mb-10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            Compare cryptocurrency prices across top global trading platforms to get the best rates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <motion.div 
              className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 transition-all duration-300 hover:bg-blue-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <RefreshCw className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-blue-100">Real-time Information</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3 transition-all duration-300 hover:bg-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-green-500/20 p-2 rounded-lg">
                <BarChart2 className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-green-100">Auto-updates Every Minute</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 transition-all duration-300 hover:bg-purple-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-purple-100">Over 10 Cryptocurrencies</span>
            </motion.div>
          </div>
        </motion.div>
      
        <motion.div 
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-10 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/30 h-fit">
              <AlertTriangle className="text-amber-400 h-6 w-6 flex-shrink-0" />
            </div>
            <div>
              <h3 className="font-bold text-amber-400 text-xl mb-2">Important Notice</h3>
              <p className="text-gray-200 leading-relaxed">
                All prices displayed are real prices from trusted sources. Data is fetched directly from the global CoinGecko API, which provides live prices from trading platforms. Prices may vary slightly between platforms due to differences in liquidity, supply, and demand.
              </p>
            </div>
          </div>
        </motion.div>
      
        <motion.div 
          className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-5 flex items-center gap-4 mb-10 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}
        >
          <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
            <Shield className="text-blue-400 h-6 w-6 flex-shrink-0" />
          </div>
          <p className="text-blue-200 font-medium">
            <strong className="text-blue-300">Data provided by:</strong> CoinGecko API - A trusted global source for cryptocurrency data
          </p>
        </motion.div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-[#0a0a1a]/80 to-[#120c28]/80 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-1 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}
