import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { getCoins } from "../lib/api"
import CoinCard from "../components/CoinCard"
import GlobalStats from "../components/GlobalStats"
import { useState } from "react"
import { RefreshCw, TrendingUp, TrendingDown, Flame } from "lucide-react"

export default function MarketPage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<"market_cap" | "price_change" | "volume">("market_cap")

  const { data: coins, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["coins", page],
    queryFn: () => getCoins(page),
    refetchInterval: 60000,
  })

  const sorted = coins ? [...coins].sort((a, b) => {
    if (sortBy === "price_change") return b.price_change_percentage_24h - a.price_change_percentage_24h
    if (sortBy === "volume") return b.total_volume - a.total_volume
    return b.market_cap - a.market_cap
  }) : []

  const gainers = coins?.filter(c => c.price_change_percentage_24h > 0).length || 0
  const losers = coins?.filter(c => c.price_change_percentage_24h < 0).length || 0

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold mb-1">
              Crypto <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Market</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Live prices — updated {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "..."}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Mini Stats */}
        {coins && (
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              {gainers} Gainers
            </div>
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              {losers} Losers
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5" />
              Top 20 by Market Cap
            </div>
          </div>
        )}
      </motion.div>

      {/* Global Stats */}
      <GlobalStats />

      {/* Sort Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gray-500 text-sm">Sort by:</span>
        {[
          { key: "market_cap", label: "Market Cap" },
          { key: "price_change", label: "24h Change" },
          { key: "volume", label: "Volume" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key as any)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              sortBy === s.key
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                  <div className="h-2 bg-white/5 rounded w-1/3" />
                </div>
              </div>
              <div className="h-12 bg-white/5 rounded mb-3" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Coins Grid */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((coin, i) => (
            <CoinCard key={coin.id} coin={coin} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-gray-400 text-sm">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 rounded-xl text-sm font-semibold transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}