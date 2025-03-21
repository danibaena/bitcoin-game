import { TOTAL_POLLING_INTERVAL_MILLISECONDS } from "@/constants"
import { useQuery } from "@tanstack/react-query"

export const API_URL = "https://api.coingecko.com/api/v3/simple/price"

export type GetBTCPriceAPIResponse = {
  bitcoin: {
    usd: number
  }
}

const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}?ids=bitcoin&vs_currencies=usd`)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    const data = (await response.json()) as GetBTCPriceAPIResponse

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

const adaptBitcoinPrice = (getBTCPriceAPIResponse: GetBTCPriceAPIResponse): number => {
  return getBTCPriceAPIResponse.bitcoin.usd
}
