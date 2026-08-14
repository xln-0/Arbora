import fp from "fastify-plugin";

import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest("user", null);

  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const sessionId = request.cookies.arbora_session;

      if (!sessionId) {
        return reply.code(401).send({
          message: "Unauthorized",
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

      if (!session || session.expiresAt <= new Date()) {
        if (session) {
          await app.prisma.session.delete({ where: { id: session.id } });
        }

        reply.clearCookie("arbora_session", { path: "/" });

        return reply.code(401).send({
          message: "Invalid session",
        });
      }

      request.user = session.user;
    },
  );

  app.decorate(
    "requireAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (request.user?.role !== "ADMIN") {
        return reply.code(403).send({
          message: "Administrator access required",
        });
      }
    },
  );
};

export default fp(authPlugin);
