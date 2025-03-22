import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"

const client = new DynamoDBClient()
const tableName = process.env.TABLE_NAME!

export const handler: APIGatewayProxyHandler = async (event) => {
  const cookies = event.headers.Cookie || event.headers.cookie || ""
  const sessionMatch = cookies.match(/sessionId=([a-zA-Z0-9-]+)/)
  const sessionId = sessionMatch?.[1]

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing sessionId cookie" }),
      headers: { "Content-Type": "application/json" },
    }
  }

  const result = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: { sessionId: { S: sessionId } },
    }),
  )

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Session not found" }),
      headers: { "Content-Type": "application/json" },
    }
  }

  const body = JSON.parse(event.body || "{}")
  const isCorrect = body.correct

  if (typeof isCorrect !== "boolean") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid 'correct' value in body" }),
      headers: { "Content-Type": "application/json" },
    }
  }

  const currentScore = parseInt(result.Item.score.N || "0")
  const newScore = isCorrect ? currentScore + 1 : currentScore - 1
  const now = Math.floor(Date.now() / 1000)

  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { sessionId: { S: sessionId } },
      UpdateExpression: "SET score = :score, lastActive = :lastActive",
      ExpressionAttributeValues: {
        ":score": { N: newScore.toString() },
        ":lastActive": { N: now.toString() },
      },
    }),
  )

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId, score: newScore }),
    headers: { "Content-Type": "application/json" },
  }
}
