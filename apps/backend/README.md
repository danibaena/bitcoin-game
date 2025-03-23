# Lambdas for Bitcoin Guessing Game

## Key Decisions

- The price endpoint has a TTL (Time To Live) of 20 seconds within the Lambda function. This means that if the Lambda is warm, it will return the same price for
  20 seconds. This helps avoid rate limiting from the external API. It does not impact the game mechanics, as guesses are made every 60 seconds, allowing the
  price to change between rounds.

- The "get or create session" endpoint generates a cookie containing a session id valid for 1 day when invoked the first time. This allows users to close and
  reopen their browser while preserving their score from the data store. The 1-day period is arbitrary and mainly intended to avoid unnecessary costs.

## Other considerations

If this app were built for production, proper authorization should be implemented, along with other security and feature considerations—such as whether the game
should be real-time, whether to use WebSockets or Server-Sent Events, and whether to expose only the minimum necessary functionality through the API.
