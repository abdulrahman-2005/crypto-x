"use client"

import { motion } from 'framer-motion'
import React from 'react'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  color?: 'blue' | 'green' | 'yellow' | 'purple'
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'left',
  color = 'blue',
  className = ''
}: SectionHeaderProps) {
  const colorMap = {
    blue: {
      from: 'from-blue-400',
      via: 'via-cyan-400',
      to: 'to-blue-500',
      text: 'text-blue-300'
    },
    green: {
      from: 'from-green-400',
      via: 'via-emerald-400',
      to: 'to-green-500',
      text: 'text-green-300'
    },
    yellow: {
      from: 'from-yellow-400',
      via: 'via-amber-400',
      to: 'to-yellow-500',
      text: 'text-yellow-300'
    },
    purple: {
      from: 'from-purple-400',
      via: 'via-violet-400',
      to: 'to-purple-500',
      text: 'text-purple-300'
    }
  }
  
  const colors = colorMap[color]
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  }
  
  return (
    <div className={`mb-8 ${alignClasses[align]} ${className}`}>
      <motion.h2 
        className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors.from} ${colors.via} ${colors.to}`}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          className={`mt-3 max-w-2xl ${alignClasses[align]} text-gray-300`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.div 
        className={`h-1 rounded-full bg-gradient-to-r ${colors.from} ${colors.to} mt-3 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`}
        style={{ width: align === 'center' ? '100px' : '60px' }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: align === 'center' ? '100px' : '60px', opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
    </div>
  )
}
