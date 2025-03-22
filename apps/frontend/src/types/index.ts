export enum GuessDirection {
  up = "up",
  down = "down",
}

export type GameState = {
  score: {
    score: number
    isLoadingSession: boolean
  }
  price: {
    currentPrice?: number | null
    isLoadingPrice: boolean
    comparedPrice: number | null
    priceAtGuessTime: number | null
  }
  guess: {
    makeGuess: (direction: GuessDirection) => void
    isGuessing: boolean
    guessResolved: boolean
    lastGuessDirection: GuessDirection | null
    isLastGuessCorrect: boolean | null
  }
  countdown: {
    guessResolutionCountdown: number | null
  }
}
