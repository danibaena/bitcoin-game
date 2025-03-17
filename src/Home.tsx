import { Button } from "@/components/ui"
import { GuessDirection, useGame } from "@/hooks/use-game"

function Home() {
  const { score, currentPrice, isloadingPrice, makeGuess, guessResolutionCountdown, isGuessing } = useGame()

  return (
    <div className="flex h-screen flex-row bg-pale">
      <div className="flex w-full flex-col items-center justify-center m-4">
        <div className="flex flex-col gap-12 rounded-xl bg-white p-16 sm:w-[640px]">
          <header className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-8 text-center">
              <div className="animate-bounce bounce-three-times w-20 h-20 md:w-40 md:h-40 delay-700">
                <img src="/favicon.svg" alt="Bitcoin Price Guessing game logo" />
              </div>
              <h1 className="text-4xl font-bold text-black">Bitcoin Price Guessing</h1>
            </div>
            <div className="flex gap-8 justify-between items-center w-1/2">
              <p className="text-black">Current price is:</p>
              {isloadingPrice || !currentPrice ? <LoadingSpinner /> : <span className="text-orange">${currentPrice}</span>}
            </div>
          </header>

          <section className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-black">What do you think the next price will be?</h2>
            <div className="flex gap-8 justify-around items-center">
              <Button
                variant="green"
                onClick={() => {
                  makeGuess(GuessDirection.up)
                }}
                disabled={isGuessing}
              >
                Price will go higher 🚀
              </Button>
              <Button
                variant="red"
                onClick={() => {
                  makeGuess(GuessDirection.down)
                }}
                disabled={isGuessing}
              >
                Price will go lower <span className="inline-block rotate-90">🚀</span>
              </Button>
            </div>
          </section>

          <footer className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-black">Your score</h2>
            <div className="text-4xl text-bold flex gap-8 justify-around">{score}</div>
            {isGuessing && (
              <div className="flex flex-col gap-2 justify-around items-center">
                <p>Waiting for resolution: {guessResolutionCountdown}s</p>
              </div>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}

const LoadingSpinner = () => {
  return (
    <svg className="size-5 animate-spin text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export { Home }
