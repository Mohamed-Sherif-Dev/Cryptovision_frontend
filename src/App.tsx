import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import MarketPage from "./pages/MarketPage"
import CoinPage from "./pages/CoinPage"
import WatchlistPage from "./pages/WatchlistPage"
import PortfolioPage from "./pages/PortfolioPage"
import { useCryptoStore } from "./store/cryptostore"

export default function App() {
  const { theme } = useCryptoStore()

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      document.body.style.backgroundColor = "#0a0a0f"
      document.body.style.color = "#ffffff"
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      document.body.style.backgroundColor = "#f8fafc"
      document.body.style.color = "#0f172a"
    }
  }, [theme])

  return (
    <BrowserRouter>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0a0a0f] text-white"
          : "bg-gray-50 text-gray-900"
      }`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/coin/:id" element={<CoinPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}