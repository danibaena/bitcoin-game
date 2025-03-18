import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("https://api.coingecko.com/api/v3/simple/price", async () => {
    return HttpResponse.json(
      {
        bitcoin: {
          // Generate random number for bitcoin price between 90000 and 80000
          usd: Math.floor(Math.random() * (90000 - 80000 + 1)) + 80000,
        },
      },
      { status: 200 },
    )
  }),
]
