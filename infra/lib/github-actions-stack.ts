import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface GitHubActionsRoleStackProps extends cdk.StackProps {
  /**
   * GitHub organization or username
   * @example "myorg" or "myusername"
   */
  readonly repoOwner: string;

  /**
   * GitHub repository name
   * @example "my-repo"
   */
  readonly repoName: string;

  /**
   * AWS Account ID of the DNS account
   */
  readonly dnsAccountId: string;

  /**
   * List of deployment stages
   */
  readonly stage: string;

  /**
   * Optional: Additional IAM policies to attach to the role
   * By default, the role will have full CDK deployment permissions
   */
  readonly additionalPolicies?: iam.IManagedPolicy[];
}

export class GitHubActionsRoleStack extends cdk.Stack {
  public readonly role: iam.Role;

  constructor(
    scope: Construct,
    id: string,
    props: GitHubActionsRoleStackProps,
  ) {
    super(scope, id, props);

    // Create OIDC provider for GitHub Actions
    const githubProvider = new iam.OpenIdConnectProvider(
      this,
      "GitHubOIDCProvider",
      {
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sts.amazonaws.com"],
      },
    );

    // Build the subject claim for the role trust policy
    let subjectClaim = `repo:${props.repoOwner}/${props.repoName}:*`;

    // Create IAM role that GitHub Actions will assume
    this.role = new iam.Role(this, "GitHubActionsDeployRole", {
      roleName: `github-actions-${props.repoOwner}-${props.repoName}-role`,
      assumedBy: new iam.FederatedPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": subjectClaim,
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      description: `Role for GitHub Actions to deploy CDK stacks from ${props.repoOwner}/${props.repoName}`,
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Add CDK deployment permissions
    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("PowerUserAccess"),
    );

    // Add IAM permissions needed for CDK bootstrapping and role management
    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:UpdateRole",
          "iam:PassRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:GetRolePolicy",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:CreatePolicy",
          "iam:DeletePolicy",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions",
          "iam:CreatePolicyVersion",
          "iam:DeletePolicyVersion",
          "iam:TagPolicy",
          "iam:UntagPolicy",
        ],
        resources: ["*"],
      }),
    );

    // Add each cross delegation role assume role perms
    const delegationRoleArn = cdk.Stack.of(this).formatArn({
      account: props.dnsAccountId,
      region: "",
      resource: "role",
      resourceName: `CrossAccountDnsManagementRole-${props.stage}`,
      service: "iam",
    });

    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sts:AssumeRole"],
        resources: [delegationRoleArn],
      }),
    );

    // Add any additional policies
    if (props.additionalPolicies) {
      props.additionalPolicies.forEach((policy) => {
        this.role.addManagedPolicy(policy);
      });
    }

    // Output the role ARN for use in GitHub Actions
    new cdk.CfnOutput(this, "RoleArn", {
      value: this.role.roleArn,
      description: "ARN of the IAM role for GitHub Actions",
      exportName: `${this.stackName}-RoleArn`,
    });

    new cdk.CfnOutput(this, "RoleName", {
      value: this.role.roleName,
      description: "Name of the IAM role for GitHub Actions",
    });
  }
}
