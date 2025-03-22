import { useGame } from "@/lib/providers"

export const CountdownDisplay = () => {
  const {
    countdown: { guessResolutionCountdown: countdownSeconds },
    guess: { isGuessing },
  } = useGame()

  if (!isGuessing || countdownSeconds === null) {
    return
  }

  return (
    <div className="flex flex-col items-center justify-around gap-2">
      <p>Waiting for guess resolution: {countdownSeconds}s</p>
    </div>
  )
}
