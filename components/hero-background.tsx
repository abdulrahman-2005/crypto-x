"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create grid lines
    const gridSize = 40
    const drawGrid = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = "rgba(138, 92, 246, 0.1)"
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
        ctx.stroke()
      }
    }

    // Animation loop
    const animate = () => {
      drawGrid()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div className="absolute inset-0 z-0">
      {/* SVG Diagonal Lines Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width="100%"
        height="100%"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.2 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8F00FF" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Diagonal lines */}
        {[...Array(30)].map((_, i) => (
          <line
            key={i}
            x1={i * 60 - 300}
            y1="0"
            x2={i * 60 + 300}
            y2="800"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}
      </svg>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0a0a1a] to-[#050510] opacity-90" />

      {/* Canvas for grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50"
      />

      {/* Single animated gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500 opacity-20"
        animate={{
          filter: ["blur(100px)", "blur(150px)", "blur(100px)"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.div>
  )
}
