#!/bin/bash

ROLE_NAME=fargate-test-role

aws iam get-role --role-name $ROLE_NAME

if [ ! $? -eq 0 ]; then
  echo Creating Role...
  aws iam create-role --role-name ROLE_NAME --assume-role-policy-document file://aws/task-executiuon-role.json
fi

aws iam attach-role-policy --role-name fargate-test-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
