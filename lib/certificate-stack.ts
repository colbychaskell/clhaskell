import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface RootCertificateStackProps extends StackProps {
  readonly rootHostedZoneId: string;
  readonly rootHostedZoneName: string;
}

export class RootCertificateStack extends Stack {
  public readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: RootCertificateStackProps) {
    super(scope, id, { ...props, env: { region: "us-east-1" } }); // Enforce us-east-1

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: props.rootHostedZoneId,
        zoneName: props.rootHostedZoneName,
      },
    );

    this.certificate = new acm.Certificate(this, "MultiDomainCertificate", {
      domainName: props.rootHostedZoneName,
      subjectAlternativeNames: [
        `*.${props.rootHostedZoneName}`,
        `prod.${props.rootHostedZoneName}`,
      ],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    new CfnOutput(this, "CertificateArnOutput", {
      value: this.certificate.certificateArn,
      description: "ARN of the ACM Certificate",
    });
  }
}
