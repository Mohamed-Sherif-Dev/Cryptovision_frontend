import { create } from "zustand"
import { persist } from "zustand/middleware"

type CryptoStore = {
  watchlist: string[]
  portfolio: { id: string; amount: number; buyPrice: number }[]
  currency: string
  theme: "dark" | "light"

  addToWatchlist: (id: string) => void
  removeFromWatchlist: (id: string) => void
  isInWatchlist: (id: string) => boolean

  addToPortfolio: (id: string, amount: number, buyPrice: number) => void
  removeFromPortfolio: (id: string) => void

  setTheme: (theme: "dark" | "light") => void
}

export const useCryptoStore = create<CryptoStore>()(
  persist(
    (set, get) => ({
      watchlist: ["bitcoin", "ethereum", "solana"],
      portfolio: [],
      currency: "usd",
      theme: "dark",

      addToWatchlist: (id) => {
        if (!get().watchlist.includes(id)) {
          set({ watchlist: [...get().watchlist, id] })
        }
      },

      removeFromWatchlist: (id) =>
        set({ watchlist: get().watchlist.filter((w) => w !== id) }),

      isInWatchlist: (id) => get().watchlist.includes(id),

      addToPortfolio: (id, amount, buyPrice) => {
        const existing = get().portfolio.find((p) => p.id === id)
        if (existing) {
          set({
            portfolio: get().portfolio.map((p) =>
              p.id === id ? { ...p, amount, buyPrice } : p
            ),
          })
        } else {
          set({ portfolio: [...get().portfolio, { id, amount, buyPrice }] })
        }
      },

      removeFromPortfolio: (id) =>
        set({ portfolio: get().portfolio.filter((p) => p.id !== id) }),

      setTheme: (theme) => set({ theme }),
    }),
    { name: "cryptovision-store" }
  )
)