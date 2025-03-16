import { Button } from "@/components/ui"
import FloatingLabelInput from "./components/ui/floating-label-input"

function Home() {
  return (
    <div className="flex h-screen flex-row bg-pale">
      <div className="flex w-full flex-col items-center justify-center">
        <form
          className="flex flex-col gap-8 rounded-xl bg-white p-16 sm:w-[640px]"
          // onSubmit={handleSubmit(onSubmit)}
        >
          <header className="flex flex-col items-center gap-4 text-center">
            <div className="animate-bounce w-20 h-20 md:w-40 md:h-40 delay-700">
              <img src="/favicon.svg" alt="Bitcoin Price Guessing game logo" />
            </div>
            <h2 className="text-4xl font-bold text-black">Bitcoin Price Guessing</h2>
            <p></p>
          </header>

          <div className="flex flex-col gap-4">
            <FloatingLabelInput label="Enter your name" />
            <Button variant="cta" size="lg">
              Start game
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { Home }
