# Bitcoin game

## Game Rules

- The player can at all times see their current score and the latest available BTC price in USD
- The player can choose to enter a guess of either “up” or “down“
- After a guess is entered the player cannot make new guesses until the existing guess is resolved
- The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
- If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user
  loses 1 point.
- Players can only make one guess at a time
- New players start with a score of 0

## Architecture

## How to run locally

### Prerequisites

#### Node version

This project uses [NVM](https://github.com/nvm-sh/nvm) (Node version manager) to automatically use **node version 22.14.0**.

#### Installing dependencies

`npm install`

### Running dev server

`npm run dev`

It will start a dev server with the frontend app using a mock server for the requests.

## Deployments

This app uses a Continuous Deployment workflow leveraging Github Actions. In every commit pushed to the repository, the Github Actions will run a deployment to
AWS. Right now the deployment flow includes:

- Infrastructure deployment to AWS. This includes S3 bucket, Cloudfront distribution, etc.
- Frontend app deployment. The job creates a new build of the app and uploads it to the S3 bucket.

If you want to deploy on your AWS account you just need to fork this repo and add the following secrets for your github actions to work

![GitHub Action Secrets](resources/github-action-secrets.png)

## Useful commands

- `npm test` run tests for all workspaces
- `npm run test --workspace <WORKSPACE>` run tests for especific `<WORKSPACE>`
- `npx prettier --write .` format the whole project
