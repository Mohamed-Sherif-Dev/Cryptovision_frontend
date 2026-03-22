import { motion } from "framer-motion"
import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { Link } from "react-router-dom"
import { useCryptoStore } from "../store/cryptostore"
import type { Coin } from "../types/crypto"
import { LineChart, Line, ResponsiveContainer } from "recharts"

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

export default function CoinCard({ coin, index }: { coin: Coin; index: number }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useCryptoStore()
  const inWatchlist = isInWatchlist(coin.id)
  const isPositive = coin.price_change_percentage_24h >= 0

  const sparklineData = coin.sparkline_in_7d?.price.map((price, i) => ({
    price,
    index: i,
  })) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white/3 border border-white/8 rounded-2xl p-4 hover:border-blue-500/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        {/* Rank */}
        <span className="text-gray-600 text-xs w-5 text-center">{coin.market_cap_rank}</span>

        {/* Image */}
        <Link to={`/coin/${coin.id}`} className="flex items-center gap-2 flex-1 min-w-0">
          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{coin.name}</p>
            <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
          </div>
        </Link>

        {/* Watchlist */}
        <button
          onClick={() => inWatchlist ? removeFromWatchlist(coin.id) : addToWatchlist(coin.id)}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Star
            className={`w-4 h-4 transition-colors ${inWatchlist ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
          />
        </button>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="h-12 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#22c55e" : "#ef4444"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">
          ${coin.current_price.toLocaleString()}
        </p>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Market Cap */}
      <p className="text-gray-500 text-xs mt-1">
        MCap: {formatNumber(coin.market_cap)}
      </p>
    </motion.div>
  )
}