import { useQuery } from "@tanstack/react-query"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getCoinDetail, getCoinChart } from "../lib/api"
import { useState } from "react"
import { ArrowLeft, Star, TrendingUp, TrendingDown } from "lucide-react"
import { useCryptoStore } from "../store/cryptostore"
import type { TimeRange } from "../types/crypto"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts"
import { format } from "date-fns"

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "24H", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y", value: "365" },
]

function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatBig(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl px-3 py-2">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white font-bold">{formatPrice(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function CoinPage() {
  const { id } = useParams<{ id: string }>()
  const [timeRange, setTimeRange] = useState<TimeRange>("7")
  const [chartType, setChartType] = useState<"area" | "line">("area")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useCryptoStore()
  const inWatchlist = isInWatchlist(id!)

  const { data: coin, isLoading: coinLoading } = useQuery({
    queryKey: ["coin", id],
    queryFn: () => getCoinDetail(id!),
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chart", id, timeRange],
    queryFn: () => getCoinChart(id!, timeRange),
  })

  const chartPoints = chartData?.prices.map(([timestamp, price]) => ({
    time: format(
      new Date(timestamp),
      timeRange === "1" ? "HH:mm" : timeRange === "7" ? "MMM dd" : "MMM dd"
    ),
    price,
  })) || []

  const priceChange = coin?.market_data.price_change_percentage_24h || 0
  const isPositive = priceChange >= 0

  if (coinLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-white/5 rounded-2xl" />
          <div className="md:col-span-2 h-48 bg-white/5 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!coin) return null

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Market
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{coin.name}</h1>
              <span className="text-gray-500 text-lg uppercase">{coin.symbol}</span>
              <span className="bg-white/5 border border-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-lg">
                #{coin.market_cap_rank}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(coin.market_data.current_price.usd)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                isPositive
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => inWatchlist ? removeFromWatchlist(id!) : addToWatchlist(id!)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${
            inWatchlist
              ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          <Star className={`w-4 h-4 ${inWatchlist ? "fill-yellow-400" : ""}`} />
          {inWatchlist ? "Watchlisted" : "Add to Watchlist"}
        </button>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6"
      >
        {/* Chart Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-2">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["area", "line"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${
                  chartType === type
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-gray-500 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {chartLoading ? (
          <div className="h-64 bg-white/3 rounded-xl animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartPoints}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Market Cap", value: formatBig(coin.market_data.market_cap.usd) },
          { label: "24h Volume", value: formatBig(coin.market_data.total_volume.usd) },
          { label: "24h High", value: formatPrice(coin.market_data.high_24h.usd) },
          { label: "24h Low", value: formatPrice(coin.market_data.low_24h.usd) },
          { label: "All Time High", value: formatPrice(coin.market_data.ath.usd) },
          { label: "ATH Change", value: `${coin.market_data.ath_change_percentage.usd.toFixed(1)}%` },
          { label: "Circulating Supply", value: `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M` },
          { label: "7d Change", value: `${coin.market_data.price_change_percentage_7d.toFixed(2)}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
            <p className="font-bold text-sm">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Description */}
      {coin.description.en && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/3 border border-white/8 rounded-2xl p-6"
        >
          <h2 className="font-bold text-lg mb-3">About {coin.name}</h2>
          <p
            className="text-gray-400 text-sm leading-relaxed line-clamp-4"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split(". ").slice(0, 3).join(". ") + "."
            }}
          />
        </motion.div>
      )}
    </div>
  )
}