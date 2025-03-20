import { API_URL, useBitcoinPrice } from "@/hooks/useBitcoinPrice"
import { server } from "@/mocks/node"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { PropsWithChildren } from "react"

const createWrapper = () => {
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

describe("useBitcoinPrice hook", () => {
  it("should return the fetched Bitcoin price", async () => {
    const wrapper = createWrapper()
    server.use(
      http.get(API_URL, async () => {
        return HttpResponse.json(
          {
            bitcoin: {
              usd: 45000,
            },
          },
          { status: 200 },
        )
      }),
    )

    const { result } = renderHook(() => useBitcoinPrice(), { wrapper })

    await waitFor(() => expect(result.current.currentPrice).toBe(45000))
  })

  it("should handle API failure gracefully", async () => {
    const wrapper = createWrapper()
    server.use(
      http.get(API_URL, async () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    const { result } = renderHook(() => useBitcoinPrice(), { wrapper })

    await waitFor(() => expect(result.current.currentPrice).toBeUndefined())
  })
})
