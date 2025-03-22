import { API_URL } from "@/constants"
import { useGetOrCreateSession } from "@/hooks/useGetOrCreateSession"
import { server } from "@/mocks/node"
import { createWrapper } from "@/mocks/utils"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"

describe("useGetOrCreateSession hook", () => {
  it("should return the fetched session data", async () => {
    const wrapper = createWrapper()
    const mockSessionData = { sesionId: "mock-session-123", score: "0" }

    server.use(
      http.get(`${API_URL}/session`, async () => {
        return HttpResponse.json(mockSessionData, { status: 200 })
      }),
    )

    const { result } = renderHook(() => useGetOrCreateSession(), { wrapper })

    await waitFor(() => expect(result.current.session).toEqual(mockSessionData))
  })

  it("should handle API failure gracefully", async () => {
    const wrapper = createWrapper()
    server.use(
      http.get(`${API_URL}/session`, async () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    const { result } = renderHook(() => useGetOrCreateSession(), { wrapper })

    await waitFor(() => expect(result.current.session).toBeUndefined())
  })
})
