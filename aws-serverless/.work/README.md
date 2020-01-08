### Install AWS CLI

Python 2 version 2.7+ or Python 3 version 3.4+ is required.

`$ pip3 install awscli --upgrade --user`

### Install AWS ECS CLI

`$ sudo curl -o /usr/local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-darwin-amd64-latest`

### Create AWS profile

Create `config` and `credentials` files in `~/.aws` directory if do not exist.

```
$ mkdir ~/.aws
$ touch ~/.aws/config
$ touch ~/.aws/credentials
```

Add following section to `~/.aws/config` file:

```
[default]
aws_access_key_id = <aws access key id>
aws_secret_access_key = <aws secret key>
region = <default aws region>
```

Add following section to `~/.aws/credentials` file:

```
[default]
aws_access_key_id = <aws access key id>
aws_secret_access_key = <aws secret key>
```

Created defauot profile will allow to avoid directly specifying AWS keys for all CLI commands or SDK function cals.

As an alternative named profile can be created and `--profile <name>` parameter passed to all CLI calls.

### References

https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-cli-tutorial-fargate.html
