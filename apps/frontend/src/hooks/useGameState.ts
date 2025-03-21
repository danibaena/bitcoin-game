import { TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { GuessDirection, useBitcoinPrice, useCountdown, useGuess } from "@/hooks"
import { useEffect, useState } from "react"

interface GameState {
  score: number
  currentPrice: number | null | undefined
  isLoadingPrice: boolean
  makeGuess: (direction: GuessDirection) => boolean
  guessResolutionCountdown: number | null
  isGuessing: boolean
  comparedPrice: number | null
  priceAtGuessTime: number | null
  guessTimestamp: number | null
  guessResolved: boolean
  lastGuessDirection: GuessDirection | null
  isLastGuessCorrect: boolean | null
}

export const useGameState = (): GameState => {
  const [score, setScore] = useState<number>(0)
  const { currentPrice, isLoadingPrice } = useBitcoinPrice()
  const { currentGuess, guessTimestamp, makeGuess: setGuess, resetGuess } = useGuess()
  const { countdown: guessResolutionCountdown, startCountdown, stopCountdown } = useCountdown()

  const [priceAtGuessTime, setPriceAtGuessTime] = useState<number | null>(null)
  const [comparedPrice, setComparedPrice] = useState<number | null>(null)
  const [guessResolved, setGuessResolved] = useState(false)
  const [lastGuessDirection, setLastGuessDirection] = useState<GuessDirection | null>(null)
  const [isLastGuessCorrect, setIsLastGuessCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (guessResolutionCountdown === null && currentGuess !== null && guessTimestamp !== null) {
      const timeElapsed = Date.now() - guessTimestamp >= TOTAL_COUNTDOWN_MILLISECONDS

      if (timeElapsed && currentPrice !== null && currentPrice !== undefined && priceAtGuessTime !== null) {
        if (currentPrice !== priceAtGuessTime) {
          const isCorrect =
            (currentGuess === GuessDirection.up && currentPrice > priceAtGuessTime) || (currentGuess === GuessDirection.down && currentPrice < priceAtGuessTime)

          setScore((prevScore) => prevScore + (isCorrect ? 1 : -1))

          setComparedPrice(currentPrice)
          setLastGuessDirection(currentGuess)
          setIsLastGuessCorrect(isCorrect)
          setGuessResolved(true)

          resetGuess()
          stopCountdown()
        }
      }
    }
  }, [currentPrice, priceAtGuessTime, currentGuess, guessTimestamp, guessResolutionCountdown, resetGuess, stopCountdown])

  const makeGuess = (direction: GuessDirection): boolean => {
    if (currentPrice !== undefined && currentPrice !== null && currentGuess === null) {
      setGuessResolved(false)
      setPriceAtGuessTime(currentPrice)
      startCountdown()
      setGuess(direction)
      return true
    }
    return false
  }

  return {
    score,
    currentPrice,
    isLoadingPrice,
    makeGuess,
    guessResolutionCountdown,
    isGuessing: currentGuess !== null,
    comparedPrice,
    priceAtGuessTime,
    guessTimestamp,
    guessResolved,
    lastGuessDirection,
    isLastGuessCorrect,
  }
}
