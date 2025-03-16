function App() {
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
            <input type="text" placeholder="your name" />

            <button className="relative hover:cursor-pointer bg-orange hover:focus:bg-yellow-600 text-white text-lg font-bold py-3 px-8 rounded-full mt-6 transition-transform transform outline-none overflow-hidden duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,152,0,0.3)] focus:-translate-y-1 focus:shadow-[0_10px_20px_rgba(255,152,0,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[rgba(255,255,255,0.1)] before:to-[rgba(255,255,255,0.3)] before:-translate-x-full before:transition-transform before:duration-[600ms] hover:before:translate-x-full focus:before:translate-x-full">
              Start game
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
