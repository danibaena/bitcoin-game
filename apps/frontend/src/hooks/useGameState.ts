import { TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { useBitcoinPrice, useCountdown, useGetOrCreateSession, useGuess, useUpdateScore } from "@/hooks"
import { GameState, GuessDirection } from "@/types"
import { useEffect, useState } from "react"

export const useGameState = (): GameState => {
  const { currentPrice, isLoadingPrice } = useBitcoinPrice()
  const { session, isLoadingSession } = useGetOrCreateSession()
  const updateScore = useUpdateScore()
  const [score, setScore] = useState<number>(0)
  const { currentGuess, guessTimestamp, makeGuess: setGuess, resetGuess } = useGuess()
  const { countdown: guessResolutionCountdown, startCountdown, stopCountdown } = useCountdown()

  const [priceAtGuessTime, setPriceAtGuessTime] = useState<number | null>(null)
  const [comparedPrice, setComparedPrice] = useState<number | null>(null)
  const [guessResolved, setGuessResolved] = useState(false)
  const [lastGuessDirection, setLastGuessDirection] = useState<GuessDirection | null>(null)
  const [isLastGuessCorrect, setIsLastGuessCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (session) {
      setScore(session.score)
    }
  }, [session])

  useEffect(() => {
    if (guessResolutionCountdown === null && currentGuess !== null && guessTimestamp !== null) {
      const timeElapsed = Date.now() - guessTimestamp >= TOTAL_COUNTDOWN_MILLISECONDS

      if (timeElapsed && currentPrice !== null && currentPrice !== undefined && priceAtGuessTime !== null) {
        if (currentPrice !== priceAtGuessTime) {
          const isCorrect =
            (currentGuess === GuessDirection.up && currentPrice > priceAtGuessTime) || (currentGuess === GuessDirection.down && currentPrice < priceAtGuessTime)

          updateScore(isCorrect)
          setScore((prevScore) => prevScore + (isCorrect ? 1 : -1))
          setIsLastGuessCorrect(isCorrect)
        } else {
          setScore((prevScore) => prevScore - 1)
          updateScore(false)
          setIsLastGuessCorrect(false)
        }

        setComparedPrice(currentPrice)
        setLastGuessDirection(currentGuess)
        setGuessResolved(true)

        resetGuess()
        stopCountdown()
      }
    }
  }, [currentPrice, priceAtGuessTime, currentGuess, guessTimestamp, guessResolutionCountdown, resetGuess, stopCountdown, updateScore])

  const makeGuess = (direction: GuessDirection) => {
    if (currentPrice !== undefined && currentPrice !== null && currentGuess === null) {
      setGuessResolved(false)
      setPriceAtGuessTime(currentPrice)
      startCountdown()
      setGuess(direction)
    }
  }

  return {
    score: {
      score,
      isLoadingSession,
    },
    price: {
      currentPrice,
      isLoadingPrice,
      comparedPrice,
      priceAtGuessTime,
    },
    guess: {
      makeGuess,
      guessResolved,
      lastGuessDirection,
      isGuessing: currentGuess !== null,
      isLastGuessCorrect,
    },
    countdown: {
      guessResolutionCountdown,
    },
  }
}
