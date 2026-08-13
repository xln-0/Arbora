import type { FastifyPluginAsync } from "fastify";

import type { CreateTreeInput, UpdateTreeInput } from "@arbora/shared";

import {
  createTree,
  deleteTree,
  getTree,
  getTreesByUser,
  updateTree,
} from "../services/treesService.js";

const treesRoutes: FastifyPluginAsync = async (app) => {
  /**
   * Crée un nouvel arbre généalogique.
   *
   * POST /trees
   *
   * Permission:
   * - Utilisateur authentifié
   */
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const body = request.body as CreateTreeInput;

      return createTree(app.prisma, request.user!.id, body);
    },
  );

  /**
   * Retourne les arbres accessibles par l'utilisateur.
   *
   * GET /trees
   *
   * Permission:
   * - Utilisateur authentifié
   */
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      return getTreesByUser(app.prisma, request.user!.id);
    },
  );

  /**
   * Retourne un arbre avec son graphe.
   *
   * GET /trees/:treeId
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/:treeId",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      return getTree(app.prisma, treeId, request.user!.id);
    },
  );

  /**
   * Modifie un arbre.
   *
   * PATCH /trees/:id
   *
   * Permission:
   * - OWNER
   */
  app.patch(
    "/:treeId",
    {
      preHandler: [app.authenticate, app.requireTreeOwner],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const body = request.body as UpdateTreeInput;

      return updateTree(app.prisma, treeId, body);
    },
  );

  /**
   * Supprime un arbre.
   *
   * DELETE /trees/:id
   *
   * Permission:
   * - OWNER
   */
  app.delete(
    "/:treeId",
    {
      preHandler: [app.authenticate, app.requireTreeOwner],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      return deleteTree(app.prisma, treeId);
    },
  );

  /**
   * Retourne le graphe d'un arbre.
   *
   * GET /trees/:treeId/graph
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/:treeId/graph",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const tree = await getTree(app.prisma, treeId, request.user!.id);

      return {
        persons: tree.persons,
        relationships: tree.relationships,
      };
    },
  );
};

export default treesRoutes;
