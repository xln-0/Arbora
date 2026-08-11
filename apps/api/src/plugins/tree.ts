import fp from "fastify-plugin";

import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const treePermissionsPlugin: FastifyPluginAsync = async (app) => {
  async function getTreeRole(request: FastifyRequest) {
    if (!request.user) {
      return null;
    }

    const { treeId } = request.params as {
      treeId: string;
    };

    const tree = await app.prisma.familyTree.findUnique({
      where: {
        id: treeId,
      },
      select: {
        ownerId: true,
        members: {
          where: {
            userId: request.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!tree) {
      return null;
    }

    if (tree.ownerId === request.user.id) {
      return "OWNER";
    }

    return tree.members[0]?.role ?? null;
  }

  app.decorate(
    "requireTreeMember",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const role = await getTreeRole(request);

      if (!role) {
        return reply.code(403).send({
          message: "Not a member of this tree",
        });
      }
    },
  );

  app.decorate(
    "requireTreeEditor",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const role = await getTreeRole(request);

      if (role !== "OWNER" && role !== "EDITOR") {
        return reply.code(403).send({
          message: "Editor permission required",
        });
      }
    },
  );

  app.decorate(
    "requireTreeOwner",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const role = await getTreeRole(request);

      if (role !== "OWNER") {
        return reply.code(403).send({
          message: "Owner permission required",
        });
      }
    },
  );
};

export default fp(treePermissionsPlugin);
