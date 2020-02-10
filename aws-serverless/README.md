### Install and configure AWS CLI

```
$ curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-macos.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
```

Export default AWS keys to credentials file:

```
echo [default] >> ~/.aws/credentials
echo aws_access_key_id = Some_AWS_Access_key >> ~/.aws/credentials
echo aws_secret_access_key = Some_AWS_Secret_Key >> ~/.aws/credentials
```

### Install Pulumi CLI:

`$ brew install pulumi`

### Login to local directory

`$ pulumi login file://$(pwd)`

### create new Pulumi stack

`$ pulumi new aws-typescript --name polis-fargate-deployment --force`

Set passphrases to be empty...
