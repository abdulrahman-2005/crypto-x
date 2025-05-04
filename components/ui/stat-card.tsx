"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
  className?: string
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  color = 'blue',
  className = ''
}: StatCardProps) {
  const colorMap = {
    blue: {
      fromBg: 'from-blue-500/10',
      toBg: 'to-blue-600/10',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconBorder: 'border-blue-500/30',
      icon: 'text-blue-400',
      value: 'text-white',
      label: 'text-blue-200',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]'
    },
    green: {
      fromBg: 'from-green-500/10',
      toBg: 'to-green-600/10',
      border: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconBorder: 'border-green-500/30',
      icon: 'text-green-400',
      value: 'text-white',
      label: 'text-green-200',
      shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]'
    },
    yellow: {
      fromBg: 'from-yellow-500/10',
      toBg: 'to-yellow-600/10',
      border: 'border-yellow-500/30',
      iconBg: 'bg-yellow-500/20',
      iconBorder: 'border-yellow-500/30',
      icon: 'text-yellow-400',
      value: 'text-white',
      label: 'text-yellow-200',
      shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]'
    },
    purple: {
      fromBg: 'from-purple-500/10',
      toBg: 'to-purple-600/10',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      iconBorder: 'border-purple-500/30',
      icon: 'text-purple-400',
      value: 'text-white',
      label: 'text-purple-200',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]'
    }
  }
  
  const colors = colorMap[color]
  
  return (
    <motion.div 
      className={`
        bg-gradient-to-br ${colors.fromBg} ${colors.toBg} backdrop-blur-sm 
        border ${colors.border} rounded-xl p-5 flex flex-col items-center 
        ${colors.shadow} transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.05, boxShadow: colors.hoverShadow.replace('hover:', '') }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className={`${colors.iconBg} p-3 rounded-lg border ${colors.iconBorder} mb-2`}>
        <Icon className={`h-8 w-8 ${colors.icon}`} />
      </div>
      <div className="text-center">
        <div className={`text-xl font-bold ${colors.value}`}>{value}</div>
        <div className={`text-sm ${colors.label}`}>{label}</div>
      </div>
    </motion.div>
  )
}
