import { APIGatewayProxyResult } from "aws-lambda"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { handler } from "./index.js"

vi.unstubAllGlobals()

const server = setupServer(
  http.get("https://api.coincap.io/v2/assets/bitcoin", () => {
    return HttpResponse.json({
      data: {
        id: "bitcoin",
        priceUsd: "67890.123456",
      },
      timestamp: Date.now(),
    })
  }),
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const event = {} as any
const context = {} as any
const callback = () => {}

describe("getBitcoinPrice Lambda", () => {
  it("returns the BTC price from CoinCap API rounded to 2 decimals", async () => {
    const response = (await handler(event, context, callback)) as APIGatewayProxyResult
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(typeof body.price).toBe("number")
    expect(body.price).toBe(67890.12)
    expect(body.source).toBe("coincap")
  })

  it("returns cached result on second call", async () => {
    const first = (await handler(event, context, callback)) as APIGatewayProxyResult
    const second = (await handler(event, context, callback)) as APIGatewayProxyResult
    const firstBody = JSON.parse(first.body)
    const secondBody = JSON.parse(second.body)

    expect(secondBody.source).toBe("cache")
    expect(secondBody.price).toBe(firstBody.price)
  })
})
