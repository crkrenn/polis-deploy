import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import config from "./config";

// create VPC
const vpc = new awsx.ec2.Vpc("vpc", {});

// create ECS Fargate cluster
const cluster = new awsx.ecs.Cluster(config.cluster.name, {
  vpc,
  tags: {
    Name: config.cluster.description
  },
});

// create Application Load Balancers for cluster
const alb = new awsx.lb.ApplicationLoadBalancer(`${config.cluster.name}-lb`, {
  external: true,
  vpc: cluster.vpc,
  securityGroups: cluster.securityGroups
});

// create public endpoints for services
const adminWeb = alb.createListener("polis-admin-web", { port: 5002, protocol: "HTTP", external: true });
const clientWeb = alb.createListener("polis-client-web", { port: 5001, protocol: "HTTP", external: true });
const serverWeb = alb.createListener("polis-server-web", { port: 5000, protocol: "HTTP", external: true });

// build and publish Docker images to a private ECR registry
const adminImg = awsx.ecs.Image.fromPath("polis-admin-img", "./polisClientAdmin");
const clientImg = awsx.ecs.Image.fromPath("polis-client-img", "./polisClientParticipation");
const serverImg = awsx.ecs.Image.fromPath("polis-server-img", "./polisServer");
const dbImg = awsx.ecs.Image.fromPath("polis-db-img", "./polisServer/Dockerfile-db");

// create a Fargate service tasks that can scale out
const adminService = new awsx.ecs.FargateService("polis-admin-srv", {
  cluster,
  desiredCount: 1,
  taskDefinitionArgs: {
    container: {
      image: adminImg,
      cpu: 102 /*10% of 1024*/,
      memory: 50 /*MB*/,
      portMappings: [adminWeb],
    },
  },
});

const clientService = new awsx.ecs.FargateService("polis-client-srv", {
  cluster,
  desiredCount: 1,
  taskDefinitionArgs: {
    container: {
      image: clientImg,
      cpu: 102 /*10% of 1024*/,
      memory: 50 /*MB*/,
      portMappings: [clientWeb],
    },
  },
});

const serverService = new awsx.ecs.FargateService("polis-server-srv", {
  cluster,
  desiredCount: 1,
  taskDefinitionArgs: {
    container: {
      image: serverImg,
      cpu: 102 /*10% of 1024*/,
      memory: 50 /*MB*/,
      portMappings: [serverWeb],
    },
  },
});

const databaseService = new awsx.ecs.FargateService("polis-db-srv", {
  cluster,
  desiredCount: 1,
  taskDefinitionArgs: {
    container: {
      image: dbImg,
      cpu: 102 /*10% of 1024*/,
      memory: 50 /*MB*/,
      portMappings: [serverWeb],
    },
  },
});

// export public endpoints
export const adminUrl = adminWeb.endpoint.hostname;
export const clientUrl = clientWeb.endpoint.hostname;
export const serverUrl = serverWeb.endpoint.hostname;
