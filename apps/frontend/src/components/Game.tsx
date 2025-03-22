import { Button, LoadingSpinner, Logo } from "@/components/ui"
import { SHOW_RESULT_MILLISECONDS } from "@/constants"
import { useGame } from "@/lib/providers"
import { cn } from "@/lib/utils"
import { GuessDirection } from "@/types"
import { useEffect, useState } from "react"

export const Game = () => {
  const {
    guess: { makeGuess, isGuessing },
  } = useGame()

  return (
    <div className="bg-pale flex h-screen flex-row">
      <div className="m-4 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col gap-12 rounded-xl bg-white p-16 xl:h-8/10 xl:w-1/2">
          <header className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-8 text-center">
              <Logo />
              <h1 className="text-4xl font-bold text-black">Bitcoin Price Guessing</h1>
            </div>
            <PriceDisplay />
          </header>

          <section className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-black">What do you think the next price will be?</h2>
            <div className="flex items-center justify-around gap-8">
              <Button variant="red" onClick={() => makeGuess(GuessDirection.down)} size="xl" className="text-xl" disabled={isGuessing}>
                Price will go lower <span className="inline-block rotate-90">🚀</span>
              </Button>
              <Button variant="green" onClick={() => makeGuess(GuessDirection.up)} size="xl" className="text-xl" disabled={isGuessing}>
                Price will go higher <span className="inline-block">🚀</span>
              </Button>
            </div>
          </section>

          <footer className="flex flex-col items-center gap-4 text-center">
            <ScoreDisplay />
            <CountdownDisplay />
            <GuessResultDisplay />
          </footer>
        </div>
      </div>
    </div>
  )
}

const PriceDisplay = () => {
  const {
    price: { currentPrice, isLoadingPrice },
  } = useGame()

  return (
    <div className="flex items-center justify-center gap-8">
      <p className="text-black">Current price is:</p>
      {isLoadingPrice || currentPrice === undefined || currentPrice === null ? (
        <LoadingSpinner />
      ) : (
        <span className="text-orange">${currentPrice.toLocaleString()}</span>
      )}
    </div>
  )
}

const CountdownDisplay = () => {
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

const ScoreDisplay = () => {
  const { score } = useGame()

  return (
    <>
      <h2 className="text-2xl font-bold text-black">Your score</h2>
      <div className="text-bold flex justify-around gap-8 text-4xl">{score}</div>
    </>
  )
}

const GuessResultDisplay = () => {
  const {
    guess: { guessResolved, lastGuessDirection, isLastGuessCorrect },
    price: { priceAtGuessTime, comparedPrice },
  } = useGame()
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (guessResolved) {
      setShowResult(true)

      const timer = setTimeout(() => {
        setShowResult(false)
      }, SHOW_RESULT_MILLISECONDS)

      return () => clearTimeout(timer)
    }
  }, [guessResolved])

  if (!guessResolved || !showResult) {
    return
  }

  return (
    <div className={cn("mt-4 flex flex-col gap-3 rounded-xl p-4 text-center", isLastGuessCorrect ? "bg-green-100" : "bg-red-100")}>
      <p className="text-lg font-bold">
        {isLastGuessCorrect ? "Correct guess!" : "Incorrect guess!"}
        {lastGuessDirection === GuessDirection.up ? " Price went higher 📈" : " Price went lower 📉"}
      </p>
      <div>
        <div className="flex items-center justify-between gap-8">
          <p className="text-black">Price at guessing:</p>
          <span className="text-orange">${priceAtGuessTime?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <p className="text-black">Price compared:</p>
          <span className="text-orange">${comparedPrice?.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-bold text-2xl">{isLastGuessCorrect ? "+1 point" : "-1 point"}</p>
    </div>
  )
}
