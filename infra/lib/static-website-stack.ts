import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import path = require("path");

export interface StaticWebsiteStackProps extends StackProps {
  /**
   * The account id for the dns account
   */
  dnsAccountId: string;

  /**
   * The hosted zone name (root domain)
   */
  rootHostedZoneName: string;

  /**
   * The subdomain for this environment (e.g., 'beta.example.com')
   */
  domainName: string;

  /**
   * Stage name (e.g., 'beta' or 'gamma')
   */
  stageName: string;
}

export class StaticWebsiteStack extends Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cf.Distribution;
  public readonly subdomainHostedZone: route53.PublicHostedZone;
  public readonly crossAccountDelegationRecord: route53.CrossAccountZoneDelegationRecord;

  constructor(scope: Construct, id: string, props: StaticWebsiteStackProps) {
    super(scope, id, props);

    // Create S3 bucket to store assets
    this.bucket = new s3.Bucket(this, `SiteBucket`, {
      bucketName: `${props.stageName}-website-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // construct the ARN for our cross account role
    const delegationRoleArn = Stack.of(this).formatArn({
      account: props.dnsAccountId,
      region: "",
      resource: "role",
      resourceName: `CrossAccountDnsManagementRole-${props.stageName}`,
      service: "iam",
    });

    // Get the role by ARN
    const delegationRole = iam.Role.fromRoleArn(
      this,
      "DelegationRole",
      delegationRoleArn,
    );

    // Create CloudFront Origin Access Identity
    const oai = new cf.OriginAccessIdentity(this, "OAI", {
      comment: `OAI for ${props.domainName}`,
    });

    // Grant cloudfront read access to the bucket
    this.bucket.grantRead(oai);

    // Create subdomain hosted zone
    this.subdomainHostedZone = new route53.PublicHostedZone(
      this,
      "subdomainHostedZone",
      {
        zoneName: props.domainName,
      },
    );

    // Create certificate in us-east-1 for CloudFront
    const certificate = new acm.Certificate(this, "SubdomainCertificate", {
      domainName: props.domainName,
      subjectAlternativeNames:
        props.stageName == "prod" ? [props.rootHostedZoneName] : [],
      // NOTE: This will require manually adding the certificate validation
      // records in the root hosted zone
      validation: acm.CertificateValidation.fromDns(),
    });

    const delegationRecord = new route53.CrossAccountZoneDelegationRecord(
      this,
      `DelegationRecord-${props.stageName}`,
      {
        delegationRole,
        delegatedZone: this.subdomainHostedZone,
        parentHostedZoneName: props.rootHostedZoneName,
      },
    );

    certificate.node.addDependency(delegationRecord);

    // Create CloudFront distribution
    this.distribution = new cf.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames:
        props.stageName == "prod"
          ? [props.rootHostedZoneName, props.domainName]
          : [props.domainName],
      certificate: certificate,
      defaultRootObject: "index.html",
      // TODO: For now just redircting home on 404
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // Setup stage subdomain dns (e.g. gamma.clhaskellelectric.com)
    // Create DNS record pointing to CloudFront in subdomain hosted zone
    new route53.ARecord(this, "AliasRecord", {
      zone: this.subdomainHostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution),
      ),
    });

    this.crossAccountDelegationRecord =
      new route53.CrossAccountZoneDelegationRecord(
        this,
        "subdomainDelegationRecord",
        {
          delegatedZone: this.subdomainHostedZone,
          parentHostedZoneName: props.rootHostedZoneName,
          delegationRole,
        },
      );

    const websiteBuildPath = path.join(
      __dirname,
      "..",
      "..",
      "website",
      "dist",
    );

    // Deploy from the build folder to the s3 bucket
    new s3deploy.BucketDeployment(this, "WebsiteDeployment", {
      sources: [s3deploy.Source.asset(websiteBuildPath)],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ["/*"],
    });

    // Outputs
    new CfnOutput(this, "DelegationRecord", {
      value: this.subdomainHostedZone.hostedZoneId,
      description: "Subdomain Hosted Zone ID",
    });

    new CfnOutput(this, "BucketName", {
      value: this.bucket.bucketName,
      description: "S3 Bucket Name",
    });

    new CfnOutput(this, "DistributionId", {
      value: this.distribution.distributionId,
      description: "CloudFront Distribution ID",
    });

    new CfnOutput(this, "DistributionDomainName", {
      value: this.distribution.distributionDomainName,
      description: "CloudFront Distribution Domain Name",
    });

    new CfnOutput(this, "WebsiteUrl", {
      value: `https://${props.domainName}`,
      description: "Website URL",
    });
  }
}
