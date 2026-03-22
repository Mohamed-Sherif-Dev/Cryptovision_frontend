import { useQuery } from "@tanstack/react-query"
import { getGlobalData } from "../lib/api"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function GlobalStats() {
  const { data } = useQuery({
    queryKey: ["global"],
    queryFn: getGlobalData,
    refetchInterval: 60000,
  })

  if (!data) return null

  const isPositive = data.market_cap_change_percentage_24h_usd >= 0

  const stats = [
    { label: "Market Cap", value: `$${(data.total_market_cap.usd / 1e12).toFixed(2)}T` },
    { label: "24h Volume", value: `$${(data.total_volume.usd / 1e9).toFixed(0)}B` },
    { label: "BTC Dominance", value: `${data.market_cap_percentage.btc.toFixed(1)}%` },
    { label: "Active Coins", value: data.active_cryptocurrencies.toLocaleString() },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Global Market</span>
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(data.market_cap_change_percentage_24h_usd).toFixed(2)}% 24h
          </div>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}