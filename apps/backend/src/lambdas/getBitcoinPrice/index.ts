import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import fetch from "node-fetch"

const API_URL = "https://api.coincap.io/v2/assets/bitcoin"
const PRICE_TTL_SECONDS = 20

// In-memory cache
let lastPrice: number | null = null
let lastUpdated: number | null = null

type CoinCapBitcoinPriceResponse = {
  data: {
    id: string
    rank: string
    symbol: string
    name: string
    supply: string
    maxSupply: string
    marketCapUsd: string
    volumeUsd24Hr: string
    priceUsd: string
    changePercent24Hr: string
    vwap24Hr: string
    explorer: string
  }
  timestamp: number
}

type BitcoinPriceResponse = {
  price: number
  source: string
}

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const now = Math.floor(Date.now() / 1000)

  if (lastPrice !== null && lastUpdated !== null && now - lastUpdated < PRICE_TTL_SECONDS) {
    return jsonResponse({ price: roundToTwoDecimals(lastPrice), source: "cache" })
  }

  try {
    const res = await fetch(API_URL)

    if (!res.ok) {
      throw new Error(`CoinCap API responded with status ${res.status}`)
    }

    const data = (await res.json()) as CoinCapBitcoinPriceResponse
    const priceUsd = parseFloat(data.data?.priceUsd)

    if (isNaN(priceUsd)) {
      throw new Error("Invalid priceUsd format from API")
    }

    lastPrice = priceUsd
    lastUpdated = now

    return jsonResponse({ price: roundToTwoDecimals(priceUsd), source: "coincap" })
  } catch (err) {
    console.error("Error fetching Bitcoin price:", err)
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch Bitcoin price" }),
      headers: { "Content-Type": "application/json" },
    }
  }
}

function jsonResponse(body: BitcoinPriceResponse) {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}
