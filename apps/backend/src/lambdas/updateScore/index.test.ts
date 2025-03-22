import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import type { APIGatewayProxyResult } from "aws-lambda"
import type { Mock } from "vitest"
import { handler } from "./index.js"

vi.mock("@aws-sdk/client-dynamodb", async () => {
  const actual = await vi.importActual<typeof import("@aws-sdk/client-dynamodb")>("@aws-sdk/client-dynamodb")

  return {
    ...actual,
    DynamoDBClient: vi.fn(() => ({
      send: vi.fn(),
    })),
  }
})

let mockSend: Mock

beforeEach(() => {
  const mockClientInstance = (DynamoDBClient as unknown as Mock).mock.results[0].value
  mockSend = mockClientInstance.send
  mockSend.mockReset()
})

const event = { headers: {}, body: {} } as any
const context = {} as any
const callback = () => {}

describe("updateScore Lambda", () => {
  it("returns 400 if sessionId cookie is missing", async () => {
    const response = (await handler(event, context, callback)) as APIGatewayProxyResult
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).error).toMatch(/sessionId/i)
  })

  it("returns 404 if session is not found", async () => {
    mockSend.mockResolvedValueOnce({ Item: undefined })

    const response = (await handler(
      {
        headers: { cookie: "sessionId=abc123" },
        body: JSON.stringify({ correct: true }),
      } as any,
      context,
      callback,
    )) as APIGatewayProxyResult

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body).error).toMatch(/Session not found/)
  })

  it("returns 400 for invalid body", async () => {
    mockSend.mockResolvedValueOnce({
      Item: { score: { N: "1" } },
    })

    const response = (await handler(
      {
        headers: { cookie: "sessionId=abc123" },
        body: "{}",
      } as any,
      context,
      callback,
    )) as APIGatewayProxyResult

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).error).toMatch(/invalid 'correct'/i)
  })

  it("correctly updates the score (+1) when guess is correct", async () => {
    mockSend.mockResolvedValueOnce({ Item: { score: { N: "2" } } }).mockResolvedValueOnce({})

    const response = (await handler(
      {
        headers: { cookie: "sessionId=abc123" },
        body: JSON.stringify({ correct: true }),
      } as any,
      context,
      callback,
    )) as APIGatewayProxyResult

    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
    expect(body.score).toBe(3)
    expect(body.sessionId).toBe("abc123")
  })

  it("correctly updates the score (-1) when guess is wrong", async () => {
    mockSend.mockResolvedValueOnce({ Item: { score: { N: "5" } } }).mockResolvedValueOnce({})

    const response = (await handler(
      {
        headers: { cookie: "sessionId=abc123" },
        body: JSON.stringify({ correct: false }),
      } as any,
      context,
      callback,
    )) as APIGatewayProxyResult

    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
    expect(body.score).toBe(4)
  })
})
