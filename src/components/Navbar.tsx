"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Search, Star, BarChart3, Moon, Sun, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCryptoStore } from "../store/cryptostore"
import { searchCoins } from "../lib/api"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const { theme, setTheme } = useCryptoStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchCoins(searchQuery),
    enabled: searchQuery.length > 2,
  })

  const isDark = theme === "dark"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
      isDark
        ? "border-white/5 bg-[#0a0a0f]/80"
        : "border-gray-200 bg-white/80"
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Crypto<span className="text-blue-400">Vision</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Market", to: "/", icon: BarChart3 },
            { label: "Watchlist", to: "/watchlist", icon: Star },
            { label: "Portfolio", to: "/portfolio", icon: TrendingUp },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            >
              <Search className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`absolute right-0 top-12 w-72 border rounded-2xl overflow-hidden shadow-2xl ${
                    isDark ? "bg-[#111] border-white/10" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-3">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search coins..."
                      className={`w-full border rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {searchResults && searchResults.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.slice(0, 8).map((coin: any) => (
                        <button
                          key={coin.id}
                          onClick={() => {
                            navigate(`/coin/${coin.id}`)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                            isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                          }`}
                        >
                          <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                          <div>
                            <p className="text-sm font-medium">{coin.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-500">#{coin.market_cap_rank}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-xl transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile */}
          <button
            className={`md:hidden p-2 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t px-4 py-4 flex flex-col gap-4 md:hidden ${
              isDark ? "border-white/5" : "border-gray-200"
            }`}
          >
            {[
              { label: "Market", to: "/" },
              { label: "Watchlist", to: "/watchlist" },
              { label: "Portfolio", to: "/portfolio" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}