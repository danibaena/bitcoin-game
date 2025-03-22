import { API_URL, TOTAL_POLLING_INTERVAL_MILLISECONDS } from "@/constants"
import { useQuery } from "@tanstack/react-query"

export type BitcoinPriceResponse = {
  price: number
  source: string
}

const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/price`)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    const data = (await response.json()) as BitcoinPriceResponse

    return adaptBitcoinPrice(data)
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error)
    throw error
  }
}

export const useBitcoinPrice = () => {
  const { data: currentPrice, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["bitcoinPrice"],
    queryFn: fetchBitcoinPrice,
    refetchInterval: TOTAL_POLLING_INTERVAL_MILLISECONDS,
  })

  return {
    currentPrice,
    isLoadingPrice,
  }
}

const adaptBitcoinPrice = (bitcoinPriceResponse: BitcoinPriceResponse): number => {
  return bitcoinPriceResponse.price
}
