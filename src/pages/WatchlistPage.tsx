import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { getCoins } from "../lib/api"
import { useCryptoStore } from "../store/cryptostore"
import { Star, TrendingUp, TrendingDown, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { LineChart, Line, ResponsiveContainer } from "recharts"

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useCryptoStore()

  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins", 1],
    queryFn: () => getCoins(1),
    refetchInterval: 60000,
  })

  const watchlistCoins = coins?.filter((c) => watchlist.includes(c.id)) || []

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold">Watchlist</h1>
        </div>
        <p className="text-gray-400">{watchlist.length} coins tracked</p>
      </motion.div>

      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 border border-white/8 rounded-2xl border-dashed"
        >
          <Star className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-2">No coins in watchlist</p>
          <p className="text-gray-600 text-sm mb-8">
            Click the star icon on any coin to add it here
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            Browse Market
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-4 animate-pulse h-20" />
              ))
            ) : (
              watchlistCoins.map((coin, i) => {
                const isPositive = coin.price_change_percentage_24h >= 0
                const sparklineData = coin.sparkline_in_7d?.price.map((price, i) => ({ price, i })) || []

                return (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/3 border border-white/8 rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-500/20 transition-all"
                  >
                    {/* Rank */}
                    <span className="text-gray-600 text-xs w-6 text-center shrink-0">
                      #{coin.market_cap_rank}
                    </span>

                    {/* Image + Name */}
                    <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{coin.name}</p>
                        <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
                      </div>
                    </Link>

                    {/* Sparkline */}
                    {sparklineData.length > 0 && (
                      <div className="w-24 h-10 hidden md:block">
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
                    <div className="text-right shrink-0">
                      <p className="font-bold">${coin.current_price.toLocaleString()}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromWatchlist(coin.id)}
                      className="p-2 text-gray-600 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}