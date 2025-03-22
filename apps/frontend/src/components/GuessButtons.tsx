import { Button } from "@/components/ui"
import { useGame } from "@/lib/providers"
import { GuessDirection } from "@/types"

export const GuessButtons = () => {
  const {
    guess: { makeGuess, isGuessing },
    score: { isLoadingSession },
  } = useGame()

  return (
    <div className="flex items-center justify-around gap-8">
      <Button variant="red" onClick={() => makeGuess(GuessDirection.down)} size="xl" className="text-xl" disabled={isGuessing || isLoadingSession}>
        Price will go lower <span className="inline-block rotate-90">🚀</span>
      </Button>
      <Button variant="green" onClick={() => makeGuess(GuessDirection.up)} size="xl" className="text-xl" disabled={isGuessing || isLoadingSession}>
        Price will go higher <span className="inline-block">🚀</span>
      </Button>
    </div>
  )
}
