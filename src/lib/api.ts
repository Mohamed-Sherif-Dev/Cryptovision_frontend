import axios from "axios"
import type { Coin, CoinDetail, ChartData } from "../types/crypto"

const BASE = "https://api.coingecko.com/api/v3"

const api = axios.create({ baseURL: BASE })

export async function getCoins(page = 1): Promise<Coin[]> {
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page,
      sparkline: true,
      price_change_percentage: "7d",
    },
  })
  return data
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const { data } = await api.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
    },
  })
  return data
}

export async function getCoinChart(id: string, days: string): Promise<ChartData> {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  })
  return data
}

export async function searchCoins(query: string) {
  const { data } = await api.get("/search", { params: { query } })
  return data.coins
}

export async function getGlobalData() {
  const { data } = await api.get("/global")
  return data.data
}