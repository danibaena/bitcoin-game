import { CountdownDisplay, GuessButtons, GuessResultDisplay, PriceDisplay, ScoreDisplay } from "@/components"
import { Logo } from "@/components/ui"

export const Game = () => {
  return (
    <div className="bg-pale flex h-screen flex-row">
      <div className="m-4 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col gap-12 rounded-xl bg-white p-16 drop-shadow-md xl:h-8/10 xl:w-1/2">
          <header className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-8 text-center">
              <Logo />
              <h1 className="text-4xl font-bold text-black">Bitcoin Price Guessing</h1>
            </div>
            <PriceDisplay />
          </header>

          <section className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-black">What do you think the next price will be?</h2>
            <GuessButtons />
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
