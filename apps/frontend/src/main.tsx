import { Game } from "@/components/Game"
import "@/index.css"
import { GameProvider } from "@/lib/providers"
import { isMockingEnabled } from "@/mocks/utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"

async function enableMocking() {
  if (!isMockingEnabled()) return

  const { worker } = await import("./mocks/browser")
  await worker.start()
}

const queryClient = new QueryClient()

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <Game />
        </GameProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
