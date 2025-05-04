export interface CryptoData {
  id: string
  name: string
  symbol: string
  price: string
  change: string
  rating: number
  imageUrl: string
  chartData: number[]
  trend: "up" | "down"
  islamicRating: "Halal" | "Controversial" | "Haram"
  shortDescription: string
  fullContent: string
  pros: string[]
  cons: string[]
  shariaRuling: "Halal" | "Controversial" | "Haram"
  rulingReason: string
}

export interface ExchangeData {
  id: string
  name: string
  rating: number
  islamicRating: "Halal" | "Controversial" | "Haram"
  fees: string
  coins: number
  imageUrl: string
  shortDescription: string
  fullContent: string
  pros: string[]
  cons: string[]
  shariaRuling: "Halal" | "Controversial" | "Haram"
  rulingReason: string
  minimumDeposit: string
  tradingPlatforms: string[]
  licensesRegulations: string[]
  paymentMethods: string[]
  customerSupport: string
}

export interface PriceComparison {
  exchangeId: string;
  exchangeName: string;
  price: number;
  volume24h: number;
  lastUpdated: Date;
}

export interface UserReview {
  id: string;
  exchangeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ExchangeNews {
  id: string;
  exchangeId: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
  category?: string | string[];
  isLocal?: boolean;
} 