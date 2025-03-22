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

const context = {} as any
const callback = () => {}

describe("getOrCreateSession Lambda", () => {
  it("returns an existing session if found in DynamoDB", async () => {
    const existingSessionId = "existing-session-id"
    const eventWithCookie = {
      headers: {
        cookie: `sessionId=${existingSessionId}`,
      },
    } as any
    mockSend.mockResolvedValueOnce({
      Item: {
        sessionId: { S: "existing-session-id" },
        score: { N: "5" },
      },
    })

    const response = (await handler(eventWithCookie, context, callback)) as APIGatewayProxyResult
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.sessionId).toBe(existingSessionId)
    expect(body.score).toBe(5)
    expect(response.headers!["Content-Type"]).toBe("application/json")
    expect(response.headers!["Set-Cookie"]).toBeUndefined()
  })

  it("creates a new session if none is provided", async () => {
    const eventWithoutCookie = {
      headers: {},
    } as any
    mockSend.mockResolvedValueOnce({})
    mockSend.mockResolvedValueOnce({})

    const response = (await handler(eventWithoutCookie, context, callback)) as APIGatewayProxyResult
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.sessionId).toMatch(/.+/) // should be a UUID
    expect(body.score).toBe(0)
    expect(response.headers!["Content-Type"]).toBe("application/json")
    expect(response.headers!["Set-Cookie"]).toContain("sessionId=")
  })
})
