import { GameProvider } from "@/lib/providers"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, RenderOptions } from "@testing-library/react"
import { PropsWithChildren, ReactElement } from "react"

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: false,
      },
    },
  })

  return ({ children }: PropsWithChildren) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,
      },
    },
  })

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <GameProvider>{children}</GameProvider>
      </QueryClientProvider>
    ),
    ...options,
  })
}
