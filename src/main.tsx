import { Home } from "@/Home"
import { GameProvider } from "@/hooks/use-game"
import "@/index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Home />
      </GameProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
