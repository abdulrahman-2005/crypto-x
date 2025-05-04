"use client"

import { motion } from "framer-motion"

export default function HeroIcon() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main icon container */}
      <motion.div
        className="relative w-64 h-64"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-cyan-500/30"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-8 rounded-full border-2 border-blue-500/30"
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Crypto symbols */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            >
              <span className="text-2xl font-bold text-purple-400">₿</span>
            </motion.div>
            <motion.div
              className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              <span className="text-2xl font-bold text-cyan-400">Ξ</span>
            </motion.div>
            <motion.div
              className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <span className="text-2xl font-bold text-blue-400">S</span>
            </motion.div>
            <motion.div
              className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            >
              <span className="text-2xl font-bold text-emerald-400">$</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-purple-500/10 blur-[40px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-cyan-500/10 blur-[30px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
} 