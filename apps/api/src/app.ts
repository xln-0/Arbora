import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import treePermissionsPlugin from "./plugins/tree.js";

import healthRoutes from "./routes/health.js";
import treesRoutes from "./routes/trees.js";
import personsRoutes from "./routes/persons.js";
import relationshipsRoutes from "./routes/relationships.js";
import authRoutes from "./routes/auth.js";
import treeMembersRoutes from "./routes/treeMembers.js";
import adminRoutes from "./routes/admin.js";
import eventsRoutes from "./routes/events.js";
import { errorHandler } from "./errors/errorHandler.js";

export function buildApp({ logger = true }: { logger?: boolean } = {}) {
  const app = Fastify({
    logger,
  });

  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? [];

  app.register(cors, {
    origin(origin, callback) {
      // Autorise les requêtes sans origin (curl, healthcheck, serveur à serveur)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed"), false);
    },

    credentials: true,

    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  app.register(cookie);

  app.register(sensible);

  app.register(prismaPlugin);

  app.register(authPlugin);

  app.register(treePermissionsPlugin);

  app.register(healthRoutes);

  app.register(authRoutes);

  app.register(adminRoutes);

  app.register(treesRoutes, {
    prefix: "/trees",
  });

  app.register(personsRoutes);

  app.register(relationshipsRoutes);

  app.register(treeMembersRoutes);

  app.register(eventsRoutes);

  app.setErrorHandler(errorHandler);

  return app;
}
