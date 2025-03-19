import { TOTAL_POLLING_INTERVAL_MILLISECONDS } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export type BitcoinPriceData = {
  bitcoin: {
    usd: number
  }
}

const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    const data = (await response.json()) as BitcoinPriceData

    return adaptBitcoinPrice(data)
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error)
    throw error
  }
}

export const useBitcoinPrice = () => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const [priceHasChanged, setPriceHasChanged] = useState(false)

  const { data: currentPrice, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["bitcoinPrice"],
    queryFn: fetchBitcoinPrice,
    refetchInterval: TOTAL_POLLING_INTERVAL_MILLISECONDS,
  })

  useEffect(() => {
    if (currentPrice === undefined || currentPrice === null) {
      return
    }

    if (previousPrice === null) {
      setPreviousPrice(currentPrice)
      setPriceHasChanged(false)
    } else if (previousPrice !== currentPrice) {
      setPriceHasChanged(true)
    }
  }, [currentPrice, previousPrice])

  return {
    currentPrice,
    previousPrice,
    setPreviousPrice,
    isLoadingPrice,
    priceHasChanged,
    resetPriceChanged: () => setPriceHasChanged(false),
  }
}

const adaptBitcoinPrice = (priceData: BitcoinPriceData): number => {
  return priceData.bitcoin.usd
}
