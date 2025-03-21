export type GameState = {
  score: number
  price: {
    currentPrice?: number | null
    isLoadingPrice: boolean
    comparedPrice: number | null
    priceAtGuessTime: number | null
  }
  guess: {
    makeGuess: (direction: GuessDirection) => boolean
    isGuessing: boolean
    guessResolved: boolean
    lastGuessDirection: GuessDirection | null
    isLastGuessCorrect: boolean | null
  }
  countdown: {
    guessTimestamp: number | null
    guessResolutionCountdown: number | null
  }
}

export enum GuessDirection {
  up = "up",
  down = "down",
}
