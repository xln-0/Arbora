import type { FastifyPluginAsync } from "fastify";

import { createTree, getTree } from "../services/treesService.js";

const treesRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const body = request.body as {
        name: string;
      };

      const tree = await createTree(app.prisma, {
        name: body.name,
        ownerId: request.user!.id,
      });

      return tree;
    },
  );

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const trees = await app.prisma.familyTree.findMany({
        where: {
          ownerId: request.user!.id,
        },
      });

      return trees;
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const tree = await getTree(app.prisma, id);

      if (!tree) {
        return reply.code(404).send({
          message: "Tree not found",
        });
      }

      return tree;
    },
  );

  app.get(
    "/:treeId/graph",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const tree = await app.prisma.familyTree.findUnique({
        where: {
          id: treeId,
        },

        include: {
          persons: true,
          relationships: true,
        },
      });

      if (!tree) {
        return reply.code(404).send({
          message: "Tree not found",
        });
      }

      return {
        persons: tree.persons,
        relationships: tree.relationships,
      };
    },
  );
};

export default treesRoutes;
