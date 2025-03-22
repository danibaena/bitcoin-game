import { useGame } from "@/lib/providers"

export const ScoreDisplay = () => {
  const { score } = useGame()

  return (
    <>
      <h2 className="text-2xl font-bold text-black">Your score</h2>
      <div className="text-bold flex justify-around gap-8 text-4xl">{score}</div>
    </>
  )
}
