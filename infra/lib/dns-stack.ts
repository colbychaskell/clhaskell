import { CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export interface DnsStackProps extends StackProps {
  readonly domainName: string;
  readonly trustedAccounts: Record<string, string>;
}

export class DnsStack extends Stack {
  public readonly hostedZone: route53.IHostedZone;
  public readonly crossAccountRole: iam.Role;

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);

    // Create root hosted zone
    this.hostedZone = new route53.PublicHostedZone(this, "RootHostedZone", {
      zoneName: props.domainName,
    });
    this.hostedZone.applyRemovalPolicy(
      RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    );

    // Create IAM role that staging accounts can assume
    for (const [stageName, account] of Object.entries(props.trustedAccounts)) {
      const crossAccountRole = new iam.Role(
        this,
        `CrossAccountDnsManagementRole-${stageName}`,
        {
          roleName: `CrossAccountDnsManagementRole-${stageName}`,
          assumedBy: new iam.AccountPrincipal(account),
          inlinePolicies: {
            delegation: new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ["route53:ListHostedZonesByName"],
                  resources: ["*"],
                }),
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ["route53:GetHostedZone"],
                  resources: [this.hostedZone.hostedZoneArn],
                }),
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ["route53:ChangeResourceRecordSets"],
                  resources: [this.hostedZone.hostedZoneArn],
                  conditions: {
                    "ForAnyValue:StringLike": {
                      "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
                        `*${stageName}.${props.domainName}`,
                      ],
                    },
                  },
                }),
              ],
            }),
          },
        },
      );

      // Output the stage subdomain cross account role arn
      new CfnOutput(this, `CrossAccountRoleArn-${stageName}`, {
        value: crossAccountRole.roleArn,
        description: "ARN of the cross-account DNS management role",
        exportName: `${this.stackName}-CrossAccountRoleArn-${stageName}`,
      });
    }

    new CfnOutput(this, "HostedZoneId", {
      value: this.hostedZone.hostedZoneId,
      description: "Hosted Zone ID",
      exportName: `${this.stackName}-HostedZoneId`,
    });

    new CfnOutput(this, "HostedZoneName", {
      value: this.hostedZone.zoneName,
      description: "Hosted Zone Name",
      exportName: `${this.stackName}-HostedZoneName`,
    });

    new CfnOutput(this, "NameServers", {
      value: Fn.join(", ", this.hostedZone.hostedZoneNameServers || []),
      description: "Name servers for the hosted zone",
    });
  }
}
