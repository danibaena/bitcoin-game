import * as cdk from "aws-cdk-lib"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as s3 from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"
import * as path from "path"

export class BitcoinGameStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, "StaticSiteBucket", {
      bucketName: "bitcoin-game",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const distribution = new cloudfront.Distribution(this, "BitcoinGameCloudFront", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
    })

    const playersTable = new dynamodb.Table(this, "PlayersTable", {
      partitionKey: { name: "sessionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: "lastActive",
    })

    const getBitcoinPriceLambda = new lambda.Function(this, "GetBitcoinPriceLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../apps/backend/dist/getBitcoinPrice")),
      environment: {},
    })

    const getOrCreateSessionLambda = new lambda.Function(this, "GetOrCreateSessionLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../apps/backend/dist/getOrCreateSession")),
      environment: {
        TABLE_NAME: playersTable.tableName,
      },
    })

    const updateScoreLambda = new lambda.Function(this, "UpdateScoreLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../apps/backend/dist/updateScore")),
      environment: {
        TABLE_NAME: playersTable.tableName,
      },
    })

    playersTable.grantReadWriteData(getOrCreateSessionLambda)
    playersTable.grantReadWriteData(updateScoreLambda)

    const api = new apigateway.RestApi(this, "BitcoinGameApi", {
      restApiName: "BitcoinGameService",
      deployOptions: {
        stageName: "prod",
      },
    })

    const apiResource = api.root.addResource("api")

    apiResource.addResource("price").addMethod("GET", new apigateway.LambdaIntegration(getBitcoinPriceLambda), {
      methodResponses: [{ statusCode: "200" }],
    })

    apiResource.addResource("session").addMethod("GET", new apigateway.LambdaIntegration(getOrCreateSessionLambda), {
      methodResponses: [{ statusCode: "200" }],
    })

    apiResource.addResource("score").addMethod("POST", new apigateway.LambdaIntegration(updateScoreLambda), {
      methodResponses: [{ statusCode: "200" }],
    })

    distribution.addBehavior(
      "/api/*",
      new origins.HttpOrigin(`${api.restApiId}.execute-api.${this.region}.amazonaws.com`, {
        originPath: "/prod",
      }),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: new cloudfront.OriginRequestPolicy(this, "ApiOriginRequestPolicy", {
          cookieBehavior: cloudfront.OriginRequestCookieBehavior.allowList("sessionId"),
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
      },
    )

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.domainName,
    })
  }
}
