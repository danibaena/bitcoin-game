import { LoadingSpinner } from "@/components/ui"
import { useGame } from "@/lib/providers"

export const PriceDisplay = () => {
  const {
    price: { currentPrice, isLoadingPrice },
  } = useGame()

  return (
    <div className="flex items-center justify-center gap-8">
      <p className="text-black">Current price is:</p>
      {isLoadingPrice || currentPrice === undefined || currentPrice === null ? (
        <LoadingSpinner />
      ) : (
        <span className="text-orange">${currentPrice.toLocaleString()}</span>
      )}
    </div>
  )
}
