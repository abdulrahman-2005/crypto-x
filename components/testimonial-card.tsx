"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  avatarUrl: string
}

export default function TestimonialCard({ name, role, quote, avatarUrl }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="bg-[#0a0a1a]/60 border-gray-800 backdrop-blur-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300 h-full">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 text-purple-400">
            <Quote className="h-8 w-8" />
          </div>

          <p className="text-gray-300 flex-grow mb-6">"{quote}"</p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Image src={avatarUrl || "/placeholder.svg"} alt={name} width={30} height={30} className="rounded-full" />
            </div>
            <div>
              <h4 className="font-bold">{name}</h4>
              <p className="text-sm text-gray-400">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
