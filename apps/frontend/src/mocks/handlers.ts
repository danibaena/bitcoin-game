import { API_URL } from "@/hooks"
import { http, HttpResponse } from "msw"

export const handlers = [
  http.get(API_URL, async () => {
    return HttpResponse.json(
      {
        bitcoin: {
          // Generate random number for bitcoin price between 90000 and 80000 in dev mode
          usd: Math.floor(Math.random() * (90000 - 80000 + 1)) + 80000,
        },
      },
      { status: 200 },
    )
  }),
]
