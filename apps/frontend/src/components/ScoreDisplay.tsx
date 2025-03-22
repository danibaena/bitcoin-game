import { LoadingSpinner } from "@/components/ui"
import { useGame } from "@/lib/providers"

export const ScoreDisplay = () => {
  const {
    score: { score, isLoadingSession },
  } = useGame()

  return (
    <>
      <h2 className="text-2xl font-bold text-black">Your score</h2>
      {isLoadingSession ? <LoadingSpinner className="size-10" /> : <p className="text-bold flex justify-around gap-8 text-4xl">{score}</p>}
    </>
  )
}
