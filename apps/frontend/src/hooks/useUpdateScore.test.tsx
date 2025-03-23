import { API_URL } from "@/constants"
import { useUpdateScore } from "@/hooks/useUpdateScore"
import { server } from "@/mocks/node"
import { createWrapper } from "@/mocks/utils"
import { renderHook } from "@testing-library/react"
import { http, HttpResponse } from "msw"

describe("useUpdateScore hook", () => {
  it("should successfully update score", async () => {
    const wrapper = createWrapper()

    server.use(
      http.post(`${API_URL}/score`, async ({ request }) => {
        const body = await request.json()
        expect(body).toEqual({ correct: true })

        return HttpResponse.json({ success: true }, { status: 200 })
      }),
    )

    const { result } = renderHook(() => useUpdateScore(), { wrapper })

    const response = await result.current(true)
    expect(response.ok).toBe(true)
  })

  it("should handle API failure gracefully", async () => {
    const wrapper = createWrapper()

    server.use(
      http.post(`${API_URL}/score`, async () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    const { result } = renderHook(() => useUpdateScore(), { wrapper })

    try {
      await result.current(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
