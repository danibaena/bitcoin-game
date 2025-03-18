import { GuessDirection, useGameState } from "@/hooks"
import { createContext, useContext } from "react"

interface GameState {
  score: number
  currentPrice: number | null | undefined
  isLoadingPrice: boolean
  makeGuess: (direction: GuessDirection) => void
  guessResolutionCountdown: number | null
}

const GameContext = createContext<GameState | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameState = useGameState()

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
