#!/usr/bin/env bash

echo Login to ECR...
eval "$(aws ecr get-login --no-include-email | sed 's|https://||')"

DIR_NAME=$1
IMAGE_NAME=$(echo $DIR_NAME | sed 's/\([a-z]\)\([A-Z]\)/\1-\2/g' | sed 's/\([A-Z]\{2,\}\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')

echo $DIR_NAME
echo $IMAGE_NAME

REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $IMAGE_NAME --output text --query repositories[*].repositoryUri)

if [ ! $? -eq 0 ]; then
  echo Creating Repository...
  REPOSITORY_URI=$(aws ecr create-repository --repository-name $IMAGE_NAME --output text --query repository.repositoryUri)
fi

cd $DIR_NAME
docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME $REPOSITORY_URI
docker push $REPOSITORY_URI
cd ..
