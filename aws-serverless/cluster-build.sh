#!/usr/bin/env bash

source ./config/.env

REGION=$(aws configure get region)
CF_STACK_NAME=amazon-ecs-cli-setup-$CLUSTER_NAME
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)

# ensure IAM role exists
aws iam get-role --role-name $FARGATE_ROLE_NAME --output text --query Role.RoleName

if [ ! $? -eq 0 ]; then
  echo Creating Role...
  aws iam create-role --role-name $FARGATE_ROLE_NAME --region $REGION --assume-role-policy-document file://config/task-execution-role.json --output text --query Role.RoleName
fi

aws iam attach-role-policy --role-name $FARGATE_ROLE_NAME --region $REGION --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# create cluster configuration and deploy CloudFormation stack
ecs-cli configure --cluster $CLUSTER_NAME --region $REGION --default-launch-type FARGATE --config-name $CLUSTER_NAME
ecs-cli up --cluster-config $CLUSTER_NAME

# extract config details from CloudFormation stack
SUBNET_ID_1=$(aws cloudformation describe-stack-resources --stack-name $CF_STACK_NAME --logical-resource-id PubSubnetAz1 --output text --query StackResources[*].PhysicalResourceId)
SUBNET_ID_2=$(aws cloudformation describe-stack-resources --stack-name $CF_STACK_NAME --logical-resource-id PubSubnetAz2 --output text --query StackResources[*].PhysicalResourceId)
VPC_ID=$(aws cloudformation describe-stack-resources --stack-name $CF_STACK_NAME --logical-resource-id Vpc --output text --query StackResources[*].PhysicalResourceId)
GROUP_ID=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$VPC_ID --region $REGION --output text --query SecurityGroups[*].GroupId)

# open required ports on cluster security group
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3001 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3002 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5000 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5001 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5002 --cidr 0.0.0.0/0 --region $REGION

# write image rpository details to docker compose file
AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID \
envsubst < ./config/docker-compose.template.yml > ./docker-compose.yml

# write cluster config details to ECS parameters file
FARGATE_ROLE_NAME=$FARGATE_ROLE_NAME \
CONTAINER_CPU_LIMIT=$CONTAINER_CPU_LIMIT \
CONTAINER_MEMORY_LIMIT=$CONTAINER_MEMORY_LIMIT \
SUBNET_ID_1=$SUBNET_ID_1 \
SUBNET_ID_2=$SUBNET_ID_2 \
GROUP_ID=$GROUP_ID \
envsubst < ./config/ecs-params.template.yml > ./ecs-params.yml

# start services defined in docker compose file
ecs-cli compose --project-name $CLUSTER_NAME service up --create-log-groups --cluster-config $CLUSTER_NAME

echo "============================="
echo "Cluster created successfully:"
echo "============================="
echo "Subnet 1:" $SUBNET_ID_1
echo "Subnet 2:" $SUBNET_ID_2
echo "Security Group:" $GROUP_ID
