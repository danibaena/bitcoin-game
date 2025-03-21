import { GuessDirection } from "@/types"
import { useState } from "react"

export interface GuessHook {
  currentGuess: GuessDirection | null
  guessTimestamp: number | null
  makeGuess: (direction: GuessDirection) => boolean
  resetGuess: () => void
}

export const useGuess = (): GuessHook => {
  const [guess, setGuess] = useState<GuessDirection | null>(null)
  const [guessTimestamp, setGuessTimestamp] = useState<number | null>(null)

  const makeGuess = (direction: GuessDirection): boolean => {
    if (guess === null) {
      setGuess(direction)
      setGuessTimestamp(Date.now())
      return true
    }
    return false
  }

  const resetGuess = (): void => {
    setGuess(null)
    setGuessTimestamp(null)
  }

  return {
    currentGuess: guess,
    guessTimestamp,
    makeGuess,
    resetGuess,
  }
}
