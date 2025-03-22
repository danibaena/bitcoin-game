# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Decisions

- Get Price lambda uses an external third party API (Coincap). To avoid rate limits in third party API, I've added some in memory cache for 20s (while lambda is
  warm). So in that period, any further request to the endpoint will be served by the cache
- Dynamo db records in table has a `timeToLiveAttribute` set in the lambda of 1 day
- Lambda to get or create a new game session will create a cookie that will last also 1 day. That means the player will be able to play during a day with the
  same score. This was added just to avoid reaching any limit in the free tier, and it's not a game requirement. Resetting the game could be a feature easily
  added, just by deleting the cookies.
