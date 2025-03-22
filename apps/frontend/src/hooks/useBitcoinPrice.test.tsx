import { API_URL, useBitcoinPrice } from "@/hooks/useBitcoinPrice"
import { server } from "@/mocks/node"
import { createWrapper } from "@/mocks/utils"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"

describe("useBitcoinPrice hook", () => {
  it("should return the fetched Bitcoin price", async () => {
    const wrapper = createWrapper()
    server.use(
      http.get(API_URL, async () => {
        return HttpResponse.json({ price: 45000.25, source: "api" }, { status: 200 })
      }),
    )

    const { result } = renderHook(() => useBitcoinPrice(), { wrapper })

    await waitFor(() => expect(result.current.currentPrice).toBe(45000.25))
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
