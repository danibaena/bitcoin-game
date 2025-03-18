import { useState } from "react"

export enum GuessDirection {
  up = "up",
  down = "down",
}

export const useGuess = () => {
  const [guess, setGuess] = useState<GuessDirection | null>(null)
  const [guessTimestamp, setGuessTimestamp] = useState<number | null>(null)

  const makeGuess = (direction: GuessDirection) => {
    if (guess === null) {
      setGuess(direction)
      setGuessTimestamp(Date.now())
      return true
    }
    return false
  }

  const resetGuess = () => {
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
