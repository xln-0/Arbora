import fp from "fastify-plugin";
import { createPrismaClient } from "@arbora/database";

const prisma = createPrismaClient();

export default fp(async (app) => {
  await prisma.$connect();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
