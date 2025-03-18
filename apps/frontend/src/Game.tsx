import { Button, LoadingSpinner, Logo } from "@/components/ui"
import { GuessDirection } from "@/hooks"
import { useGame } from "@/lib/providers"
import { useEffect, useMemo, useState } from "react"

const SHOW_RESULT_MILLISECONDS = 5000

export const Game = () => {
  const { score, currentPrice, isLoadingPrice, makeGuess, guessResolutionCountdown } = useGame()
  const [prevPrice, setPrevPrice] = useState<number | null>(null)
  const [currentGuessDirection, setCurrentGuessDirection] = useState<GuessDirection | null>(null)
  const [guessResult, setGuessResult] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isGuessing, setIsGuessing] = useState(false)

  useEffect(() => {
    if (currentPrice !== undefined && currentPrice !== null) {
      if (prevPrice !== null && prevPrice !== currentPrice && isGuessing && guessResolutionCountdown === 0) {
        if (currentGuessDirection === GuessDirection.up) {
          setGuessResult(currentPrice > prevPrice)
        } else if (currentGuessDirection === GuessDirection.down) {
          setGuessResult(currentPrice < prevPrice)
        }
        setShowResult(true)

        setIsGuessing(false)
        setTimeout(() => {
          setShowResult(false)
          setGuessResult(null)
          setCurrentGuessDirection(null)
        }, SHOW_RESULT_MILLISECONDS)
      }

      setPrevPrice(currentPrice)
    }
  }, [currentPrice, prevPrice, isGuessing, guessResolutionCountdown, currentGuessDirection])

  const handleGuess = useMemo(
    () => (direction: GuessDirection) => {
      setIsGuessing(true)
      setCurrentGuessDirection(direction)
      makeGuess(direction)
    },
    [makeGuess, setIsGuessing],
  )

  return (
    <div className="flex h-screen flex-row bg-pale ">
      <div className="flex w-full flex-col items-center justify-center m-4">
        <div className="flex flex-col gap-12 rounded-xl bg-white p-16 sm:w-1/2 h-8/10">
          <header className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-8 text-center">
              <Logo />
              <h1 className="text-4xl font-bold text-black">Bitcoin Price Guessing</h1>
            </div>
            <PriceDisplay price={currentPrice} isLoading={isLoadingPrice} />
          </header>

          <section className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-black">What do you think the next price will be?</h2>
            <div className="flex gap-8 justify-around items-center">
              <Button variant="red" onClick={() => handleGuess(GuessDirection.down)} size="xl" className="text-xl" disabled={isGuessing}>
                Price will go lower <span className="inline-block rotate-90">🚀</span>
              </Button>
              <Button variant="green" onClick={() => handleGuess(GuessDirection.up)} size="xl" className="text-xl" disabled={isGuessing}>
                Price will go higher <span className="inline-block">🚀</span>
              </Button>
            </div>
          </section>

          <footer className="flex flex-col items-center gap-4 text-center">
            <ScoreDisplay score={score} />
            {isGuessing && guessResolutionCountdown !== 0 && <CountdownDisplay seconds={guessResolutionCountdown} />}
            {showResult && <GuessResultDisplay isVisible={showResult} isCorrect={guessResult} guessDirection={currentGuessDirection} />}
          </footer>
        </div>
      </div>
    </div>
  )
}

const PriceDisplay = ({ price, isLoading }: { price: number | null | undefined; isLoading: boolean }) => (
  <div className="flex gap-8 justify-between items-center w-1/2">
    <p className="text-black">Current price is:</p>
    {isLoading || !price ? <LoadingSpinner /> : <span className="text-orange">${price.toLocaleString()}</span>}
  </div>
)

const CountdownDisplay = ({ seconds }: { seconds: number | null }) => (
  <div className="flex flex-col gap-2 justify-around items-center">{seconds !== null && <p>Waiting for resolution: {seconds}s</p>}</div>
)

const ScoreDisplay = ({ score }: { score: number }) => (
  <>
    <h2 className="text-2xl font-bold text-black">Your score</h2>
    <div className="text-4xl text-bold flex gap-8 justify-around">{score}</div>
  </>
)

const GuessResultDisplay = ({
  isVisible,
  isCorrect,
  guessDirection,
}: {
  isVisible: boolean
  isCorrect: boolean | null
  guessDirection: GuessDirection | null
}) => {
  if (!isVisible || isCorrect === null || !guessDirection) return null

  return (
    <div className={`mt-4 p-4 rounded-xl ${isCorrect ? "bg-green-100" : "bg-red-100"} text-center`}>
      <p className="font-bold">
        {isCorrect ? "Correct guess!" : "Incorrect guess!"}
        {guessDirection === GuessDirection.up ? " Price went higher 📈" : " Price went lower 📉"}
      </p>
      <p>{isCorrect ? "+1 point" : "-1 point"}</p>
    </div>
  )
}
