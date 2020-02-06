#!/usr/bin/env node

import "source-map-support/register";
import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import ecsPatterns = require("@aws-cdk/aws-ecs-patterns");

import config from "./config";

const app = new cdk.App();
const stack = new cdk.Stack(app, "polis");

// build polis database service
const dbService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, "polis-db", {
  desiredCount: 1,
  assignPublicIp: true,
  listenerPort: config.postgres.port,

  cpu: 512,
  memoryLimitMiB: 2048,

  cloudMapOptions: { },

  taskImageOptions: {
    containerName: "postgres",
    containerPort: config.postgres.port,
    image: ecs.ContainerImage.fromAsset("./polisDatabase", {
      buildArgs: {
        ... config.postgres.args
      }
    }),
  },
});

dbService.service.connections.allowFromAnyIpv4(
  ec2.Port.tcp(config.postgres.port)
);

// build polis server service
const serverService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "polis-server", {
  desiredCount: 1,
  assignPublicIp: true,
  listenerPort: config.server.port,

  cpu: 512,
  memoryLimitMiB: 2048,

  taskImageOptions: {
    containerName: "polis-server",
    containerPort: config.server.port,

    image: ecs.ContainerImage.fromAsset("./polisServer", {
      buildArgs: {
        ... config.server.args,
        // host: serverWeb.endpoint.hostname,
        // static_files_host: clientWeb.endpoint.hostname,
        // static_files_admin_host: adminWeb.endpoint.hostname,
        // postgres_host: dbService.loadBalancer.loadBalancerDnsName,
        postgres_pwd: config.postgres.args.pwd,
      }
    }),
  },
});

serverService.service.connections.allowFromAnyIpv4(
  ec2.Port.tcp(config.server.port)
);
