#!/bin/bash

source ./config/.env

REGION=$(aws configure get region)

# tire down docker compose services
ecs-cli compose --project-name $CLUSTER_NAME service down --cluster $CLUSTER_NAME
ecs-cli compose --project-name $CLUSTER_NAME service rm --cluster $CLUSTER_NAME

# delete CloudFormation stack
ecs-cli down --region $REGION --cluster $CLUSTER_NAME --cluster-config $CLUSTER_NAME
