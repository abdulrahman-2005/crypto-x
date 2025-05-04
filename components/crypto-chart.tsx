"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const data = [
  { name: "Jan", Bitcoin: 42000, Ethereum: 3200, Cardano: 1.2, Solana: 140 },
  { name: "Feb", Bitcoin: 44500, Ethereum: 3100, Cardano: 1.1, Solana: 130 },
  { name: "Mar", Bitcoin: 40000, Ethereum: 2800, Cardano: 0.9, Solana: 110 },
  { name: "Apr", Bitcoin: 41200, Ethereum: 3000, Cardano: 1.0, Solana: 120 },
  { name: "May", Bitcoin: 38000, Ethereum: 2600, Cardano: 0.85, Solana: 100 },
  { name: "Jun", Bitcoin: 36000, Ethereum: 2400, Cardano: 0.75, Solana: 90 },
  { name: "Jul", Bitcoin: 39000, Ethereum: 2700, Cardano: 0.9, Solana: 115 },
  { name: "Aug", Bitcoin: 43000, Ethereum: 3100, Cardano: 1.1, Solana: 135 },
  { name: "Sep", Bitcoin: 45000, Ethereum: 3300, Cardano: 1.25, Solana: 145 },
  { name: "Oct", Bitcoin: 48000, Ethereum: 3500, Cardano: 1.3, Solana: 155 },
  { name: "Nov", Bitcoin: 52000, Ethereum: 3800, Cardano: 1.4, Solana: 165 },
  { name: "Dec", Bitcoin: 49000, Ethereum: 3600, Cardano: 1.35, Solana: 160 },
]

const comparisonData = [
  { feature: "Decentralization", Bitcoin: 90, Ethereum: 85, Cardano: 80, Solana: 70 },
  { feature: "Scalability", Bitcoin: 50, Ethereum: 65, Cardano: 75, Solana: 95 },
  { feature: "Security", Bitcoin: 95, Ethereum: 90, Cardano: 85, Solana: 80 },
  { feature: "Energy Efficiency", Bitcoin: 30, Ethereum: 60, Cardano: 90, Solana: 85 },
  { feature: "Developer Activity", Bitcoin: 85, Ethereum: 95, Cardano: 80, Solana: 90 },
  { feature: "Islamic Compliance", Bitcoin: 85, Ethereum: 70, Cardano: 90, Solana: 75 },
]

export default function CryptoChart() {
  const [timeframe, setTimeframe] = useState("1Y")
  const [chartType, setChartType] = useState("price")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="price" onValueChange={setChartType} className="w-full sm:w-auto">
          <TabsList className="bg-[#0a0a1a] border border-gray-800 rounded-full overflow-hidden">
            <TabsTrigger
              value="price"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full"
            >
              Price History
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full"
            >
              Comparison
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {chartType === "price" && (
          <div className="flex gap-2 overflow-x-auto">
            {["1W", "1M", "3M", "6M", "1Y"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                className={`rounded-full px-3 py-1 h-auto ${
                  timeframe === period
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800/50"
                }`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[400px] w-full">
        {chartType === "price" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a1a",
                  borderColor: "#374151",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Bitcoin"
                stroke="#f7931a"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Ethereum"
                stroke="#627eea"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Cardano"
                stroke="#0033ad"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Solana"
                stroke="#00ffbd"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="feature" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a1a",
                  borderColor: "#374151",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Bitcoin"
                stroke="#f7931a"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Ethereum"
                stroke="#627eea"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Cardano"
                stroke="#0033ad"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Solana"
                stroke="#00ffbd"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
