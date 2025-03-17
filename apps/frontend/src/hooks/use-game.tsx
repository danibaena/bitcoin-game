import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"

interface GameState {
  score: number
  currentPrice: number | null | undefined
  isloadingPrice: boolean
  makeGuess: (direction: GuessDirection) => void
  guessResolutionCountdown: number | null
  isGuessing: boolean
}

const GameContext = createContext<GameState | undefined>(undefined)

export type BitcoinPriceData = {
  bitcoin: {
    usd: number
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export enum GuessDirection {
  up = "up",
  down = "down",
}

const fetchBitcoinPrice = async () => {
  // return 80000
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
  const data: BitcoinPriceData = await response.json()
  return data.bitcoin.usd
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<number>(0)
  const [guessResolutionCountdown, setGuessResolutionCountdown] = useState<number | null>(null)

  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const [guess, setGuess] = useState<GuessDirection | null>(null)
  const [guessTimestamp, setGuessTimestamp] = useState<number | null>(null)

  const { data: currentPrice, isLoading: isloadingPrice } = useQuery({
    queryKey: ["bitcoinPrice"],
    queryFn: fetchBitcoinPrice,
    refetchInterval: 10000,
    enabled: false,
  })

  useEffect(() => {
    if (currentPrice !== undefined) {
      setPreviousPrice((prev) => (prev !== currentPrice ? prev : prev))
    }
  }, [currentPrice])

  useEffect(() => {
    if (guess && previousPrice !== null && currentPrice !== null && currentPrice !== undefined && guessTimestamp) {
      const timeElapsed = Date.now() - guessTimestamp

      if (timeElapsed >= 60000 && previousPrice !== currentPrice) {
        const isCorrect = (guess === GuessDirection.up && currentPrice > previousPrice) || (guess === GuessDirection.down && currentPrice < previousPrice)
        setScore((prevScore) => prevScore + (isCorrect ? 1 : -1))

        // Reset game state after guess resolution
        setGuess(null)
        setGuessTimestamp(null)
        setGuessResolutionCountdown(null)
      }
    }
  }, [currentPrice, previousPrice, guess, guessTimestamp])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (guessResolutionCountdown !== null && guessResolutionCountdown > 0) {
      timer = setInterval(() => {
        setGuessResolutionCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null))
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [guessResolutionCountdown])

  const makeGuess = (direction: GuessDirection) => {
    if (guess === null) {
      setGuessResolutionCountdown(60)
      setGuess(direction)
      setGuessTimestamp(Date.now())
    }
  }

  const isGuessing = guessResolutionCountdown !== null

  return (
    <GameContext.Provider value={{ score, currentPrice, isloadingPrice, makeGuess, guessResolutionCountdown, isGuessing }}>{children}</GameContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
