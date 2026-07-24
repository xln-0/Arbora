import type { FastifyInstance } from "fastify";
import { login } from "../services/authService.js";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const user = await login(app.prisma, email, password);

      const session = await app.prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });

      reply.setCookie("arbora_session", session.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true en prod HTTPS
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
  });

  app.get("/auth/me", async (request, reply) => {
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

  app.post("/auth/logout", async (request, reply) => {
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
  });
}
