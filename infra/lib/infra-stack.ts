import * as cdk from "aws-cdk-lib"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"

import * as s3 from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

export class BitcoinGameStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // S3 Bucket
    const bucket = new s3.Bucket(this, "StaticSiteBucket", {
      bucketName: "bitcoin-game",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "BitcoinGameCloudFront", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
    })

    // Output CloudFront URL
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.domainName,
    })
  }
}
