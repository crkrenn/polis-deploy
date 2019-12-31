#!/bin/bash

function get_repository_uri() {
  local IMAGE_NAME=$1

  local REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $IMAGE_NAME --output text --query repositories[*].repositoryUri)

  if [ ! $? -eq 0 ]; then
    echo Creating Repository...
    REPOSITORY_URI=$(aws ecr create-repository --repository-name $IMAGE_NAME --output text --query repository.repositoryUri)
  fi

  return $REPOSITORY_URI
}

function push_image() {
  local IMAGE_NAME=$1
  local REPOSITORY_URI=get_repository_uri $1

  if [ ! $? -eq 0 ]; then
    echo Creating Repository...
    REPOSITORY_URI=$(aws ecr create-repository --repository-name $IMAGE_NAME --output text --query repository.repositoryUri)
  fi

  cd $IMAGE_NAME
  docker build -t $IMAGE_NAME .
  docker tag test-app $REPOSITORY_URI
  docker push $REPOSITORY_URI
  cd ..
}

echo Login to ECR...
eval "$(aws ecr get-login --no-include-email | sed 's|https://||')"

push_image test-app
