import type { FastifyPluginAsync } from "fastify";

import type {
  CreateRelationshipInput,
  UpdateRelationshipInput,
} from "@arbora/shared";

import {
  createRelationship,
  getRelationshipsByTree,
  deleteRelationship,
  updateRelationship,
} from "../services/relationshipsService.js";

const relationshipsRoutes: FastifyPluginAsync = async (app) => {
  /**
   * Crée une relation entre deux personnes.
   *
   * POST /trees/:treeId/relationships
   *
   * Permission:
   * - OWNER
   * - EDITOR
   *
   * Body:
   * {
   *   sourcePersonId: string,
   *   targetPersonId: string,
   *   type: RelationshipType,
   *   unionDate?: string,
   *   marriageDate?: string,
   *   divorceDate?: string
   * }
   */
  app.post(
    "/trees/:treeId/relationships",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request, reply) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const body = request.body as CreateRelationshipInput;

      const relationship = await createRelationship(app.prisma, treeId, body);

      return reply.status(201).send(relationship);
    },
  );

  /**
   * Retourne toutes les relations d'un arbre.
   *
   * GET /trees/:treeId/relationships
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/trees/:treeId/relationships",
    {
      preHandler: [app.authenticate, app.requireTreeMember],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      return getRelationshipsByTree(app.prisma, treeId);
    },
  );

  app.patch(
    "/trees/:treeId/relationships/:relationshipId",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId, relationshipId } = request.params as {
        treeId: string;
        relationshipId: string;
      };
      const body = request.body as UpdateRelationshipInput;

      return updateRelationship(
        app.prisma,
        treeId,
        relationshipId,
        body,
      );
    },
  );

  /**
   * Supprime une relation.
   *
   * DELETE /trees/:treeId/relationships/:relationshipId
   *
   * Permission:
   * - OWNER
   * - EDITOR
   */
  app.delete(
    "/trees/:treeId/relationships/:relationshipId",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId, relationshipId } = request.params as {
        treeId: string;
        relationshipId: string;
      };

      return deleteRelationship(app.prisma, treeId, relationshipId);
    },
  );
};

export default relationshipsRoutes;
