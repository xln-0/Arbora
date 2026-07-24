import type { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  app.get("/health/database", async () => {
    const users = await app.prisma.user.count();

    return {
      database: "connected",

      users,
    };
  });
};

export default healthRoutes;
