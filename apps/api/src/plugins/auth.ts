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

      if (!session) {
        return reply.code(401).send({
          message: "Invalid session",
        });
      }

      request.user = session.user;
    },
  );
};

export default fp(authPlugin);
