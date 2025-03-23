# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Key Decisions

- The **Get Price** Lambda uses an external third-party API (Coincap). To avoid hitting rate limits, an in-memory cache with a 20-second TTL is implemented
  while the Lambda is warm. During this period, repeated requests to the endpoint are served from the cache.

- DynamoDB records include a `timeToLiveAttribute` set to expire after 1 day, ensuring automatic cleanup of outdated entries.

- The Lambda responsible for getting or creating a new game session sets a cookie with a 1-day expiration, aligned with the DynamoDB TTL. This allows players to
  retain their score and continue playing throughout the day, even if they close and reopen their browser.

- I chose to use the same CloudFront distribution for both serving the app and the API. Any request to `/api/*` is forwarded to API Gateway and handled by the
  corresponding Lambdas. This setup helps avoid CORS issues and simplifies development. However, it may not be ideal for production, as SPAs often have route
  handling that could conflict with API paths.
