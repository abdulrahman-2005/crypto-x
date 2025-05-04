"use client"

import React from 'react'
import { motion } from 'framer-motion'

type GlowCardProps = {
  children: React.ReactNode
  className?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
  hoverEffect?: boolean
  glowEffect?: boolean
  onClick?: () => void
}

export default function GlowCard({
  children,
  className = '',
  color = 'blue',
  hoverEffect = true,
  glowEffect = true,
  onClick
}: GlowCardProps) {
  const colorMap = {
    blue: {
      from: 'from-[#0a0a1a]/80',
      to: 'to-[#120c28]/80',
      border: 'border-blue-500/20',
      hoverBorder: 'group-hover:border-blue-500/40',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      hoverShadow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
      glow: 'bg-blue-500/0',
      hoverGlow: 'group-hover:bg-blue-500/5'
    },
    green: {
      from: 'from-[#0a0a1a]/80',
      to: 'to-[#120c28]/80',
      border: 'border-green-500/20',
      hoverBorder: 'group-hover:border-green-500/40',
      shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]',
      hoverShadow: 'group-hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]',
      glow: 'bg-green-500/0',
      hoverGlow: 'group-hover:bg-green-500/5'
    },
    yellow: {
      from: 'from-[#0a0a1a]/80',
      to: 'to-[#120c28]/80',
      border: 'border-yellow-500/20',
      hoverBorder: 'group-hover:border-yellow-500/40',
      shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]',
      hoverShadow: 'group-hover:shadow-[0_0_25px_rgba(234,179,8,0.2)]',
      glow: 'bg-yellow-500/0',
      hoverGlow: 'group-hover:bg-yellow-500/5'
    },
    purple: {
      from: 'from-[#0a0a1a]/80',
      to: 'to-[#120c28]/80',
      border: 'border-purple-500/20',
      hoverBorder: 'group-hover:border-purple-500/40',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
      hoverShadow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
      glow: 'bg-purple-500/0',
      hoverGlow: 'group-hover:bg-purple-500/5'
    }
  }
  
  const colors = colorMap[color]
  
  return (
    <motion.div
      className={`
        group bg-gradient-to-br ${colors.from} ${colors.to} backdrop-blur-sm 
        border ${colors.border} rounded-2xl overflow-hidden 
        transition-all duration-300 relative
        ${hoverEffect ? `${colors.hoverBorder} ${colors.shadow} ${colors.hoverShadow} group-hover:translate-y-[-5px]` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {glowEffect && (
        <div className={`
          absolute inset-0 transition-colors duration-300
          ${colors.glow} ${colors.hoverGlow}
        `} />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {glowEffect && (
        <motion.div
          className="absolute -inset-1 opacity-0 group-hover:opacity-20 z-0 transition-opacity duration-300"
          animate={{
            background: [
              `radial-gradient(circle at 50% 0%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 0%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 10%, transparent 60%)`,
              `radial-gradient(circle at 50% 0%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  )
}
