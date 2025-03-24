import { SHOW_RESULT_MILLISECONDS } from "@/constants"
import { useGame } from "@/lib/providers"
import { cn } from "@/lib/utils"
import { GuessDirection } from "@/types"
import { useEffect, useState } from "react"

export const GuessResultDisplay = () => {
  const {
    guess: { guessResolved, lastGuessDirection, isLastGuessCorrect },
    price: { priceAtGuessTime, comparedPrice },
  } = useGame()
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (guessResolved) {
      setShowResult(true)

      const timer = setTimeout(() => {
        setShowResult(false)
      }, SHOW_RESULT_MILLISECONDS)

      return () => clearTimeout(timer)
    }
  }, [guessResolved])

  if (!guessResolved || !showResult) {
    return
  }

  return (
    <div className={cn("mt-4 flex flex-col gap-3 rounded-xl p-4 text-center", isLastGuessCorrect ? "bg-green-100" : "bg-red-100")}>
      <p className="text-lg font-bold">{isLastGuessCorrect ? "Correct guess!" : "Incorrect guess!"}</p>
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-black">Your guess:</p>
            <span>{lastGuessDirection === GuessDirection.up ? " Price will go higher 📈" : " Price will go lower 📉"}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-black">Result:</p>
            <PriceMessage priceAtGuessTime={priceAtGuessTime} comparedPrice={comparedPrice} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-black">Price at guessing:</p>
            <span className="text-orange">${priceAtGuessTime?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-black">Price compared:</p>
            <span className="text-orange">${comparedPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <p className="text-bold text-2xl">{isLastGuessCorrect ? "+1 point" : "-1 point"}</p>
    </div>
  )
}

type PriceMessageProps = {
  priceAtGuessTime: number | null
  comparedPrice: number | null
}

const PriceMessage = ({ priceAtGuessTime, comparedPrice }: PriceMessageProps) => {
  if (priceAtGuessTime === comparedPrice && priceAtGuessTime !== null) {
    return <span>" Price remained the same 🟰"</span>
  }

  return <span>{priceAtGuessTime! < comparedPrice! ? " Price went higher 📈" : " Price went lower 📉"}</span>
}
