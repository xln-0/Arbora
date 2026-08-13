import type { FastifyInstance, FastifyReply } from "fastify";

import {
  createInitialAdmin,
  isSetupRequired,
  login,
} from "../services/authService.js";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

async function openSession(
  app: FastifyInstance,
  reply: FastifyReply,
  userId: string,
) {
  const session = await app.prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  reply.setCookie("arbora_session", session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: session.expiresAt,
  });
}

export default async function authRoutes(app: FastifyInstance) {
  app.get("/auth/setup", async () => ({
    setupRequired: await isSetupRequired(app.prisma),
  }));

  app.post("/auth/setup", async (request, reply) => {
    const body = request.body as { email?: string; password?: string };
    const user = await createInitialAdmin(app.prisma, {
      email: body?.email ?? "",
      password: body?.password ?? "",
    });

    await openSession(app, reply, user.id);

    return reply.code(201).send({ user });
  });

  app.post("/auth/login", async (request, reply) => {
    const body = request.body as { email?: string; password?: string };

    try {
      const user = await login(
        app.prisma,
        body?.email ?? "",
        body?.password ?? "",
      );

      await openSession(app, reply, user.id);

      return { user };
    } catch {
      return reply.status(401).send({
        message: "Invalid credentials",
      });
    }
  });

  app.get(
    "/auth/me",
    { preHandler: [app.authenticate] },
    async (request) => ({
      user: {
        id: request.user!.id,
        email: request.user!.email,
        role: request.user!.role,
      },
    }),
  );

  app.post("/auth/logout", async (request, reply) => {
    const sessionId = request.cookies.arbora_session;

    if (sessionId) {
      await app.prisma.session.deleteMany({ where: { id: sessionId } });
    }

    reply.clearCookie("arbora_session", { path: "/" });

    return reply.status(204).send();
  });
}
