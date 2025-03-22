import { APIGatewayProxyHandler } from "aws-lambda"
import fetch from "node-fetch"

// In-memory cache
let lastPrice: number | null = null
let lastUpdated: number | null = null

const PRICE_TTL = 20

type CryptoApiResponse = {
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

type GetBitcoinPriceResponse = {
  price: string
  source: string
}

export const handler: APIGatewayProxyHandler = async () => {
  const now = Math.floor(Date.now() / 1000)

  if (lastPrice !== null && lastUpdated !== null && now - lastUpdated < PRICE_TTL) {
    return jsonResponse({ price: lastPrice.toFixed(2), source: "cache" })
  }

  try {
    const res = await fetch("https://api.coincap.io/v2/assets/bitcoin")

    if (!res.ok) {
      throw new Error(`CoinCap API responded with status ${res.status}`)
    }

    const data = (await res.json()) as CryptoApiResponse
    const priceUsd = parseFloat(data.data?.priceUsd)

    if (isNaN(priceUsd)) {
      throw new Error("Invalid priceUsd format from API")
    }

    lastPrice = priceUsd
    lastUpdated = now

    return jsonResponse({ price: priceUsd.toFixed(2), source: "coincap" })
  } catch (err) {
    console.error("Error fetching Bitcoin price:", err)
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch Bitcoin price" }),
      headers: { "Content-Type": "application/json" },
    }
  }
}

function jsonResponse(body: GetBitcoinPriceResponse) {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }
}
