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
  const isPriceUnchanged = priceAtGuessTime === comparedPrice

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
      <p className="text-lg font-bold">
        {isLastGuessCorrect ? "Correct guess!" : "Incorrect guess!"}
        {isPriceUnchanged ? " Price remained the same 🟰" : lastGuessDirection === GuessDirection.up ? " Price went higher 📈" : " Price went lower 📉"}
      </p>
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
      <p className="text-bold text-2xl">{isLastGuessCorrect ? "+1 point" : "-1 point"}</p>
    </div>
  )
}
