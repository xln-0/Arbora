import type { FastifyPluginAsync } from "fastify";

import {
  createTree,
  deleteTree,
  getTree,
  updateTree,
} from "../services/treesService.js";

const treesRoutes: FastifyPluginAsync = async (app) => {
  // Create a tree

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

  // Get User's trees

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

  // Get Tree

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

  // Update tree

  app.patch(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { id } = request.params as {
        id: string;
      };

      const body = request.body as {
        name: string;
      };

      return updateTree(app.prisma, id, body as any);
    },
  );

  // Supprimer

  app.delete("/:id", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    return deleteTree(app.prisma, id);
  });

  // Get graph

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
