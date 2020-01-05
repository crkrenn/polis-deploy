#!/bin/bash

REGION=us-east-1
CLUSTER_NAME=test-cluster
ROLE_NAME=fargate-test-role

aws iam create-role --role-name $ROLE_NAME --region $REGION --assume-role-policy-document file://aws/task-execution-role.json
aws iam attach-role-policy --role-name $ROLE_NAME --region $REGION --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

ecs-cli configure --cluster $CLUSTER_NAME --region $REGION --default-launch-type FARGATE --config-name fargate
ecs-cli up --cluster-config fargate

SUBNET_ID_1=$(aws cloudformation describe-stack-resources --stack-name amazon-ecs-cli-setup-$CLUSTER_NAME  --logical-resource-id PubSubnetAz1 --output text --query StackResources[*].PhysicalResourceId)
SUBNET_ID_2=$(aws cloudformation describe-stack-resources --stack-name amazon-ecs-cli-setup-$CLUSTER_NAME  --logical-resource-id PubSubnetAz2 --output text --query StackResources[*].PhysicalResourceId)
VPC_ID=$(aws cloudformation describe-stack-resources --stack-name amazon-ecs-cli-setup-$CLUSTER_NAME  --logical-resource-id Vpc --output text --query StackResources[*].PhysicalResourceId)
GROUP_ID=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$VPC_ID --region $REGION --output text  --query SecurityGroups[*].GroupId)

aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3001 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 3002 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5000 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5001 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 5002 --cidr 0.0.0.0/0 --region $REGION

echo "Subnet 1:" $SUBNET_ID_1
echo "Subnet 2:" $SUBNET_ID_2
echo "Security Group:" $GROUP_ID
echo "Role Name:" $ROLE_NAME

ecs-cli compose --project-name $CLUSTER_NAME service up --create-log-groups --cluster-config fargate
