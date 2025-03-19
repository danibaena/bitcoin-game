import { COUNTDOWN_INTERVAL_MILLISECONDS, TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { GuessDirection, useBitcoinPrice, useCountdown, useGuess } from "@/hooks"
import { useEffect, useState } from "react"

export const useGameState = () => {
  const [score, setScore] = useState<number>(0)
  const { currentPrice, previousPrice, isLoadingPrice } = useBitcoinPrice()
  const { currentGuess, guessTimestamp, makeGuess: setGuess, resetGuess } = useGuess()
  const { countdown: guessResolutionCountdown, startCountdown, stopCountdown } = useCountdown(null)

  useEffect(() => {
    if (currentGuess && previousPrice !== null && currentPrice !== null && currentPrice !== undefined && guessTimestamp) {
      const timeElapsed = Date.now() - guessTimestamp

      if (timeElapsed >= TOTAL_COUNTDOWN_MILLISECONDS && previousPrice !== currentPrice) {
        const isCorrect =
          (currentGuess === GuessDirection.up && currentPrice > previousPrice) || (currentGuess === GuessDirection.down && currentPrice < previousPrice)

        setScore((prevScore) => prevScore + (isCorrect ? 1 : -1))

        resetGuess()
        stopCountdown()
      }
    }
  }, [currentPrice, previousPrice, currentGuess, guessTimestamp, resetGuess, stopCountdown])

  const makeGuess = (direction: GuessDirection) => {
    startCountdown(TOTAL_COUNTDOWN_MILLISECONDS / COUNTDOWN_INTERVAL_MILLISECONDS)
    setGuess(direction)
  }

  return {
    score,
    currentPrice,
    isLoadingPrice,
    makeGuess,
    guessResolutionCountdown,
  }
}
