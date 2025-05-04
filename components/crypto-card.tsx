import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface CryptoCardProps {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  rating: number
  imageUrl: string
  trend: "up" | "down"
  islamicRating: "Halal" | "Controversial"
  shortDescription: string
}

export function CryptoCard({
  id,
  name,
  symbol,
  price,
  change,
  rating,
  imageUrl,
  trend,
  islamicRating,
  shortDescription
}: CryptoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={imageUrl} alt={name} className="w-10 h-10 rounded-full" />
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <p className="text-sm text-gray-500">{symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {change}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">${price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Current Price</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{rating}/5</p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{islamicRating}</p>
              <p className="text-sm text-gray-500">Islamic Rating</p>
            </div>
            <Link href={`/cryptocurrencies/${id}`} passHref>
              <Button asChild>
                <span>Read Review</span>
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{shortDescription}</p>
        </div>
      </CardContent>
    </Card>
  )
} 