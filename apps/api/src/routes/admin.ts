import type { FastifyPluginAsync } from "fastify";
import type { CreateAppUserInput } from "@arbora/shared";

import { createAppUser, getAppUsers } from "../services/authService.js";

const adminRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/admin/users",
    { preHandler: [app.authenticate, app.requireAdmin] },
    async () => ({ users: await getAppUsers(app.prisma) }),
  );

  app.post(
    "/admin/users",
    { preHandler: [app.authenticate, app.requireAdmin] },
    async (request, reply) => {
      const user = await createAppUser(
        app.prisma,
        request.body as CreateAppUserInput | undefined,
      );

      return reply.code(201).send({ user });
    },
  );
};

export default adminRoutes;
