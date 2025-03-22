import { API_URL } from "@/constants"
import { delay, http, HttpResponse } from "msw"

export const handlers = [
  http.get(`${API_URL}/price`, async () => {
    await delay(800)
    // Generate random number for bitcoin price between 90000 and 80000 with 2 decimals in dev mode
    return HttpResponse.json({ price: (Math.random() * (90000 - 80000) + 80000).toFixed(2), source: "api" }, { status: 200 })
  }),
  http.get(`${API_URL}/session`, async () => {
    const newSessionId = "12345"
    const ttlSeconds = 10

    await delay(800)
    return HttpResponse.json(
      { sessionId: newSessionId, score: 0 },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionId=${newSessionId}; HttpOnly; Path=/; Max-Age=${ttlSeconds}; SameSite=Lax`,
        },
      },
    )
  }),
]
