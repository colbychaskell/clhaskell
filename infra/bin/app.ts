#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DnsStack } from "../lib/dns-stack";
import { StaticWebsiteStack } from "../lib/static-website-stack";
import { GitHubActionsRoleStack } from "../lib/github-actions-stack";

const app = new cdk.App();

// Get configuration from CDK context (passed via --context or cdk.json)
// This allows values to be overridden in CI/CD with secrets
const config = {
  dnsAccount:
    app.node.tryGetContext("dnsAccount") || process.env.DNS_ACCOUNT_ID,
  gammaAccount:
    app.node.tryGetContext("gammaAccount") || process.env.GAMMA_ACCOUNT_ID,
  prodAccount:
    app.node.tryGetContext("prodAccount") || process.env.PROD_ACCOUNT_ID,
  domainName: app.node.tryGetContext("domainName") || process.env.DOMAIN_NAME,
  region: app.node.tryGetContext("region") || "us-east-1",
  repoOwner:
    app.node.tryGetContext("repoOwner") || process.env.GITHUB_REPOSITORY_OWNER,
  repoName: app.node.tryGetContext("repoName") || process.env.REPO_NAME,
};

// Validate required configuration
const requiredEnvironmentVars = [
  "dnsAccount",
  "gammaAccount",
  "prodAccount",
  "domainName",
  "repoOwner",
  "repoName",
];

for (const field of requiredEnvironmentVars) {
  if (!config[field as keyof typeof config]) {
    throw new Error(
      `Missing required configuration: ${field}. ` +
        `Set via --context ${field}=value or environment variable ${field.toUpperCase()}`,
    );
  }
}

// Deploy DNS Stack to DNS Account
new DnsStack(app, "DnsStack", {
  env: {
    account: config.dnsAccount,
    region: config.region,
  },
  domainName: config.domainName,
  trustedAccounts: {
    gamma: config.gammaAccount,
    prod: config.prodAccount,
  },
});

// Deploy Gamma Website Stack to Gamma Account
new StaticWebsiteStack(app, "GammaStaticWebsiteStack", {
  env: {
    account: config.gammaAccount,
    region: config.region,
  },
  dnsAccountId: config.dnsAccount,
  rootHostedZoneName: config.domainName,
  domainName: `gamma.${config.domainName}`,
  stageName: "gamma",
});

// Deploy Production Website Stack to Prod Account
// Production uses the root domain (no subdomain prefix)
new StaticWebsiteStack(app, "ProdStaticWebsiteStack", {
  env: {
    account: config.prodAccount,
    region: config.region,
  },
  dnsAccountId: config.dnsAccount,
  rootHostedZoneName: config.domainName,
  domainName: `prod.${config.domainName}`,
  stageName: "prod",
});

// Create the role for GitHub actions to use the accounts
new GitHubActionsRoleStack(app, "GammaGitHubActionsRole", {
  env: {
    account: config.gammaAccount,
    region: config.region,
  },
  repoOwner: config.repoOwner,
  repoName: config.repoName,
});

// Create the role for GitHub actions to use the accounts
new GitHubActionsRoleStack(app, "ProdGitHubActionsRole", {
  env: {
    account: config.prodAccount,
    region: config.region,
  },
  repoOwner: config.repoOwner,
  repoName: config.repoName,
});

app.synth();
