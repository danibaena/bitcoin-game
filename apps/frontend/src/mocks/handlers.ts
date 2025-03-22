import { API_URL } from "@/hooks"
import { http, HttpResponse } from "msw"

export const handlers = [
  http.get(API_URL, async () => {
    // Generate random number for bitcoin price between 90000 and 80000 with 2 decimals in dev mode
    return HttpResponse.json({ price: (Math.random() * (90000 - 80000) + 80000).toFixed(2), source: "api" }, { status: 200 })
  }),
]
