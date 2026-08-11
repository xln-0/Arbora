import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { login } from "../services/authService.js";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

/**
 * Authentifie un utilisateur et crée une session.
 *
 * POST /auth/login
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Retour:
 * {
 *   user: User
 * }
 *
 * Cookie créé:
 * - arbora_session (httpOnly)
 */
export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        const user = await login(app.prisma, email, password);

        const session = await app.prisma.session.create({
          data: {
            userId: user.id,
            expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
          },
        });

        reply.setCookie("arbora_session", session.id, {
          httpOnly: true,
          sameSite: "lax",
          secure: false, // true en production HTTPS
          path: "/",
          expires: session.expiresAt,
        });

        return {
          user,
        };
      } catch {
        return reply.status(401).send({
          message: "Invalid credentials",
        });
      }
    },
  );

  /**
   * Retourne l'utilisateur actuellement connecté.
   *
   * GET /auth/me
   *
   * Nécessite:
   * - Cookie arbora_session valide
   *
   * Retour:
   * {
   *   user: {
   *     id: string,
   *     email: string
   *   }
   * }
   */
  app.get("/auth/me", async (request: FastifyRequest, reply: FastifyReply) => {
    const sessionId = request.cookies.arbora_session;

    if (!sessionId) {
      return reply.status(401).send({
        message: "Not authenticated",
      });
    }

    const session = await app.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return reply.status(401).send({
        message: "Not authenticated",
      });
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    };
  });

  /**
   * Déconnecte l'utilisateur courant.
   *
   * POST /auth/logout
   *
   * Action:
   * - Supprime la session côté base de données
   * - Supprime le cookie arbora_session
   *
   * Retour:
   * - 204 No Content
   */
  app.post(
    "/auth/logout",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sessionId = request.cookies.arbora_session;

      if (sessionId) {
        await app.prisma.session.deleteMany({
          where: {
            id: sessionId,
          },
        });
      }

      reply.clearCookie("arbora_session", {
        path: "/",
      });

      return reply.status(204).send();
    },
  );
}
