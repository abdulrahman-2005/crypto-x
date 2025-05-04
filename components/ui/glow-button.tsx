"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type GlowButtonProps = {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

export default function GlowButton({ 
  href, 
  onClick, 
  children, 
  className = '',
  color = 'blue'
}: GlowButtonProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      hoverBg: 'hover:bg-blue-500/20',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      hoverBg: 'hover:bg-green-500/20',
      shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      hoverBg: 'hover:bg-yellow-500/20',
      shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      hoverBg: 'hover:bg-purple-500/20',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'
    }
  }
  
  const colors = colorMap[color]
  
  const buttonClasses = `
    ${colors.bg} ${colors.border} ${colors.text} ${colors.hoverBg} 
    ${colors.shadow} ${colors.hoverShadow}
    px-6 py-3 rounded-full border backdrop-blur-sm
    transition-all duration-300 font-medium
    flex items-center gap-2 relative overflow-hidden
    ${className}
  `
  
  const ButtonContent = () => (
    <>
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 10%, transparent 60%)`,
            `radial-gradient(circle at 50% 50%, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#a855f7'} 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </>
  )
  
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <ButtonContent />
      </Link>
    )
  }
  
  return (
    <button onClick={onClick} className={buttonClasses}>
      <ButtonContent />
    </button>
  )
}
