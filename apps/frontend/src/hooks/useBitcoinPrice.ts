import { TOTAL_POLLING_INTERVAL_MILLISECONDS } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export type BitcoinPriceData = {
  bitcoin: {
    usd: number
  }
}

const fetchBitcoinPrice = async (): Promise<number> => {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
  const data: BitcoinPriceData = await response.json()
  return data.bitcoin.usd
}

export const useBitcoinPrice = () => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)

  const { data: currentPrice, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["bitcoinPrice"],
    queryFn: fetchBitcoinPrice,
    refetchInterval: TOTAL_POLLING_INTERVAL_MILLISECONDS,
  })

  useEffect(() => {
    if (currentPrice !== undefined && previousPrice !== currentPrice) {
      setPreviousPrice(currentPrice)
    }
  }, [currentPrice, previousPrice])

  return {
    currentPrice,
    previousPrice,
    isLoadingPrice,
  }
}
