import type { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (app) => {
  /**
   * Vérifie que l'API Fastify est démarrée.
   *
   * GET /health
   *
   * Utilisation:
   * - Monitoring
   * - Vérification rapide du serveur
   *
   * Retour:
   * {
   *   status: "ok"
   * }
   */
  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  /**
   * Vérifie la connexion entre l'API et la base de données.
   *
   * GET /health/database
   *
   * Utilisation:
   * - Debug développement
   * - Vérification Prisma/PostgreSQL
   *
   * Retour:
   * {
   *   database: "connected",
   * }
   */
  app.get("/health/database", async () => {
    await app.prisma.$queryRaw`SELECT 1`;

    return {
      database: "connected",
    };
  });
};

export default healthRoutes;
