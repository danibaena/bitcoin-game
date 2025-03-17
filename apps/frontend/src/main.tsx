import { Home } from "@/Home"
import { GameProvider } from "@/hooks/use-game"
import "@/index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"

async function enableMocking() {
  if (import.meta.env.MODE !== "development") return

  const { worker } = await import("./mocks/browser")
  await worker.start()
}

const queryClient = new QueryClient()

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <Home />
        </GameProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
