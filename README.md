
# CryptoVision 📊

> Real-time Cryptocurrency Dashboard

A full-featured crypto tracking dashboard built with React, TypeScript, and Recharts. Live price data, interactive charts, portfolio tracker, and watchlist — all in a beautiful dark/light UI with smooth animations.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22c55e?style=for-the-badge)
![Framer](https://img.shields.io/badge/Framer_Motion-Animations-ff0055?style=for-the-badge)

---

## ✨ Features

### 📈 Market Overview
- Live prices for top 100 cryptocurrencies
- Real-time updates every 60 seconds
- Sort by Market Cap, 24h Change, or Volume
- Gainers/Losers counter
- Global market stats (Total Market Cap, BTC Dominance)
- Sparkline 7-day mini charts per coin

### 🔍 Search
- Instant search across all CoinGecko coins
- Autocomplete dropdown with coin logos
- Navigate directly to any coin page

### 📊 Coin Details
- Interactive Area & Line Charts
- 5 time ranges: 24H / 7D / 30D / 90D / 1Y
- Key metrics: Market Cap, Volume, ATH, Supply
- Price change indicators with animations
- Coin description

### ⭐ Watchlist
- Add/remove coins with one click
- Persistent across sessions (localStorage)
- Sparkline charts per coin
- Live price updates

### 💼 Portfolio Tracker
- Track your crypto holdings
- Real-time P&L calculation per asset
- Total portfolio value vs invested
- Allocation Pie Chart
- Add/remove assets easily

### 🎨 UI/UX
- Dark / Light mode toggle with animation
- Smooth page transitions with Framer Motion
- Loading skeletons
- Fully responsive — mobile, tablet, desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animations | Framer Motion |
| State | Zustand (with persist) |
| Data Fetching | TanStack React Query |
| API | CoinGecko API (free) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Deploy | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/cryptovision.git
cd cryptovision
