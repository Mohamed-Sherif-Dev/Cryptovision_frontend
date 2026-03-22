export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  total_volume: number
  high_24h: number
  low_24h: number
  circulating_supply: number
  total_supply: number | null
  sparkline_in_7d?: { price: number[] }
}

export type CoinDetail = {
  id: string
  symbol: string
  name: string
  image: { large: string }
  market_cap_rank: number
  description: { en: string }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    high_24h: { usd: number }
    low_24h: { usd: number }
    circulating_supply: number
    total_supply: number | null
    ath: { usd: number }
    ath_change_percentage: { usd: number }
  }
}

export type ChartData = {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export type TimeRange = "1" | "7" | "30" | "90" | "365"