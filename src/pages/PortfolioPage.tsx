import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { getCoins } from "../lib/api"
import { useCryptoStore } from "../store/cryptostore"
import { useState } from "react"
import { TrendingUp, TrendingDown, Plus, Trash2, Wallet } from "lucide-react"
import { Link } from "react-router-dom"
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6"]

export default function PortfolioPage() {
  const { portfolio, addToPortfolio, removeFromPortfolio } = useCryptoStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ id: "", amount: "", buyPrice: "" })

  const { data: coins } = useQuery({
    queryKey: ["coins", 1],
    queryFn: () => getCoins(1),
    refetchInterval: 60000,
  })

  const portfolioData = portfolio.map((item) => {
    const coin = coins?.find((c) => c.id === item.id)
    if (!coin) return null
    const currentValue = coin.current_price * item.amount
    const investedValue = item.buyPrice * item.amount
    const pnl = currentValue - investedValue
    const pnlPercent = ((currentValue - investedValue) / investedValue) * 100
    return { ...item, coin, currentValue, investedValue, pnl, pnlPercent }
  }).filter(Boolean) as any[]

  const totalValue = portfolioData.reduce((acc, p) => acc + p.currentValue, 0)
  const totalInvested = portfolioData.reduce((acc, p) => acc + p.investedValue, 0)
  const totalPnl = totalValue - totalInvested
  const totalPnlPercent = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0
  const isTotalPositive = totalPnl >= 0

  const pieData = portfolioData.map((p) => ({
    name: p.coin.name,
    value: p.currentValue,
  }))

  function handleAdd() {
    if (!form.id || !form.amount || !form.buyPrice) return
    addToPortfolio(form.id, parseFloat(form.amount), parseFloat(form.buyPrice))
    setForm({ id: "", amount: "", buyPrice: "" })
    setShowAdd(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold">Portfolio</h1>
          </div>
          <p className="text-gray-400">{portfolio.length} assets tracked</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6"
          >
            <h2 className="font-bold mb-4">Add New Asset</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Coin ID</label>
                <input
                  type="text"
                  placeholder="e.g. bitcoin, ethereum"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Amount</label>
                <input
                  type="number"
                  placeholder="0.5"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Buy Price ($)</label>
                <input
                  type="number"
                  placeholder="45000"
                  value={form.buyPrice}
                  onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.id || !form.amount || !form.buyPrice}
                className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
              >
                Add Asset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {portfolio.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 border border-white/8 rounded-2xl border-dashed"
        >
          <Wallet className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-2">No assets yet</p>
          <p className="text-gray-600 text-sm mb-8">
            Add your crypto holdings to track your portfolio value
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add First Asset
          </button>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Total Value</p>
              <p className="text-3xl font-bold">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Total Invested</p>
              <p className="text-3xl font-bold">${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className={`border rounded-2xl p-5 ${isTotalPositive ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <p className="text-gray-400 text-sm mb-1">Total P&L</p>
              <div className="flex items-center gap-2">
                <p className={`text-3xl font-bold ${isTotalPositive ? "text-green-400" : "text-red-400"}`}>
                  {isTotalPositive ? "+" : ""}${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <span className={`text-sm font-semibold ${isTotalPositive ? "text-green-400" : "text-red-400"}`}>
                  ({isTotalPositive ? "+" : ""}{totalPnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Assets List */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {portfolioData.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/3 border border-white/8 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Link to={`/coin/${item.id}`}>
                        <img src={item.coin.image} alt={item.coin.name} className="w-10 h-10 rounded-full" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/coin/${item.id}`}>
                          <p className="font-semibold hover:text-blue-400 transition-colors">{item.coin.name}</p>
                        </Link>
                        <p className="text-gray-500 text-xs">
                          {item.amount} {item.coin.symbol.toUpperCase()} @ ${item.buyPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${item.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {item.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {item.pnl >= 0 ? "+" : ""}${item.pnl.toFixed(2)} ({item.pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromPortfolio(item.id)}
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pie Chart */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Allocation</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Value"] as [string, string]}
                    contentStyle={{ background: "#111", border: "1px solid #ffffff15", borderRadius: "12px" }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}