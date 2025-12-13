# clhaskell

## Initial Deployment

To bootstrap the IAM role for Github Actions, you must first locally deploy the github actions stacks
in the target accounts.


### Manual Actions

Deploying a new ACM certificate for prod required manually creating the CNAME
records for certificate validation in the DNS root hosted zone.

For now, you need to manually add the records to point the root domain and www
subdomain to cloudfront prod distribution.

The root hosted zone will also need the records from [MS 365 Admin Center](
https://go.microsoft.com/fwlink/p/?linkid=2024339) to connect with ms 365.

## CDK Notes

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
