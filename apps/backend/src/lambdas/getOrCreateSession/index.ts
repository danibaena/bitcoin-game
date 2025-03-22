import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { v4 as uuidv4 } from "uuid"

const client = new DynamoDBClient()
const tableName = process.env.TABLE_NAME!

export const handler: APIGatewayProxyHandler = async (event) => {
  const cookies = event.headers.Cookie || event.headers.cookie || ""
  const sessionMatch = cookies.match(/sessionId=([a-zA-Z0-9-]+)/)
  const sessionId = sessionMatch?.[1]

  if (sessionId) {
    const result = await client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: { sessionId: { S: sessionId } },
      }),
    )

    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          sessionId,
          score: parseInt(result.Item.score.N || "0"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    }
  }

  const newSessionId = uuidv4()
  const now = Math.floor(Date.now() / 1000)
  const ttlSeconds = 60 * 60 * 24 * 2
  const expiresAt = now + ttlSeconds

  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        sessionId: { S: newSessionId },
        score: { N: "0" },
        lastActive: { N: expiresAt.toString() },
      },
    }),
  )

  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "Set-Cookie": `sessionId=${newSessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`,
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId: newSessionId, score: 0 }),
    headers,
  }
}
