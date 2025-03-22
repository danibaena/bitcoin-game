import { API_URL } from "@/constants"
import { delay, http, HttpResponse } from "msw"

const defaultDelay = 800
let callCount = 0

export const handlers = [
  http.get(`${API_URL}/price`, async () => {
    await delay(defaultDelay)
    // Generate random number for bitcoin price between 90000 and 80000 with 2 decimals in dev mode
    return HttpResponse.json({ price: (Math.random() * (90000 - 80000) + 80000).toFixed(2), source: "api" }, { status: 200 })
  }),
  http.get(`${API_URL}/session`, async () => {
    callCount++
    const newSessionId = "12345"
    const ttlSeconds = 10

    let score = 0
    if (callCount > 1) {
      score = callCount - 1
    }
    await delay(defaultDelay)
    return HttpResponse.json(
      { sessionId: newSessionId, score },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionId=${newSessionId}; HttpOnly; Path=/; Max-Age=${ttlSeconds}; SameSite=Lax`,
        },
      },
    )
  }),

  http.post(`${API_URL}/score`, async ({ request }) => {
    await delay(defaultDelay)
    const body = (await request.json()) as { isCorrect: boolean }
    const { isCorrect } = body
    const score = 0 + (isCorrect ? 1 : -1)

    return HttpResponse.json(
      { sessionId: "12345", score },
      {
        status: 200,
      },
    )
  }),
]
