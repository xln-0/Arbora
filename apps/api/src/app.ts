import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";

import healthRoutes from "./routes/health.js";
import treesRoutes from "./routes/trees.js";
import personsRoutes from "./routes/persons.js";
import relationshipsRoutes from "./routes/relationships.js";
import authRoutes from "./routes/auth.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
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

  app.register(prismaPlugin);

  app.register(authPlugin);

  app.register(healthRoutes);

  app.register(authRoutes);

  app.register(treesRoutes, {
    prefix: "/trees",
  });

  app.register(personsRoutes);

  app.register(relationshipsRoutes);

  return app;
}
