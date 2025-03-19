import { TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { GuessDirection, useBitcoinPrice, useCountdown, useGuess } from "@/hooks"
import { useEffect, useState } from "react"

interface GameState {
  score: number
  currentPrice: number | null | undefined
  previousPrice: number | null
  isLoadingPrice: boolean
  makeGuess: (direction: GuessDirection) => boolean
  guessResolutionCountdown: number | null
  currentGuess: GuessDirection | null
  guessTimestamp: number | null
  guessResolved: boolean
  lastGuessDirection: GuessDirection | null
  lastGuessCorrect: boolean | null
}

export const useGameState = (): GameState => {
  const [score, setScore] = useState<number>(0)
  const { currentPrice, previousPrice, setPreviousPrice, isLoadingPrice, priceHasChanged, resetPriceChanged } = useBitcoinPrice()
  const { currentGuess, guessTimestamp, makeGuess: setGuess, resetGuess } = useGuess()
  const { countdown: guessResolutionCountdown, startCountdown, stopCountdown } = useCountdown(null)

  const [guessResolved, setGuessResolved] = useState(false)
  const [lastGuessDirection, setLastGuessDirection] = useState<GuessDirection | null>(null)
  const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (currentGuess !== null && guessTimestamp !== null && previousPrice !== null && currentPrice !== null && currentPrice !== undefined && priceHasChanged) {
      const timeElapsed = Date.now() - guessTimestamp

      if (timeElapsed >= TOTAL_COUNTDOWN_MILLISECONDS) {
        const isCorrect =
          (currentGuess === GuessDirection.up && currentPrice > previousPrice) || (currentGuess === GuessDirection.down && currentPrice < previousPrice)

        setScore((prevScore) => prevScore + (isCorrect ? 1 : -1))

        setLastGuessDirection(currentGuess)
        setLastGuessCorrect(isCorrect)

        setGuessResolved(true)

        resetGuess()
        stopCountdown()
        resetPriceChanged()
      }
    }
  }, [currentPrice, previousPrice, currentGuess, guessTimestamp, resetGuess, stopCountdown, priceHasChanged, resetPriceChanged])

  const makeGuess = (direction: GuessDirection): boolean => {
    if (currentPrice !== undefined && currentPrice !== null && currentGuess === null) {
      setGuessResolved(false)
      setPreviousPrice(currentPrice)

      startCountdown()

      setGuess(direction)

      return true
    }
    return false
  }

  return {
    score,
    currentPrice,
    previousPrice,
    isLoadingPrice,
    makeGuess,
    guessResolutionCountdown,
    currentGuess,
    guessTimestamp,
    guessResolved,
    lastGuessDirection,
    lastGuessCorrect,
  }
}
