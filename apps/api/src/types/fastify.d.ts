import { PrismaClient } from "@arbora/database";
import type { User } from "@arbora/shared";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { preHandlerHookHandler } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
  }

  interface FastifyInstance {
    prisma: PrismaClient;

    authenticate: preHandlerHookHandler;
    requireAdmin: preHandlerHookHandler;
    requireTreeOwner: preHandlerHookHandler;
    requireTreeEditor: preHandlerHookHandler;
    requireTreeMember: preHandlerHookHandler;
  }
}
