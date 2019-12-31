"use strict";

import aws from "aws-sdk";
import config from "./config.js";

const ecr = new aws.ECR(config.aws);

function ensureRepository() {
  return ecr.describeRepositories({
    repositoryNames: [config.ecr.repositoryName]
  }).promise()
    .then(x => x.repositories && x.repositories[0])
    .catch(() => ecr.createRepository({
      repositoryName: config.ecr.repositoryName
    }).promise());
}

(async () => {
  const repo = await ensureRepository();
  console.log(repo);
})().then(process.exit);
