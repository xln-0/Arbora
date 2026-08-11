import type { FastifyPluginAsync } from "fastify";

import type { AddTreeMemberInput, UpdateTreeMemberInput } from "@arbora/shared";

import {
  getTreeMembers,
  addTreeMember,
  updateTreeMemberRole,
  removeTreeMember,
} from "../services/treeMembersService.js";

const treeMembersRoutes: FastifyPluginAsync = async (app) => {
  /**
   * Retourne les membres d'un arbre.
   *
   * GET /trees/:treeId/members
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/trees/:treeId/members",
    {
      preHandler: [app.authenticate, app.requireTreeMember],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      return getTreeMembers(app.prisma, treeId);
    },
  );

  /**
   * Ajoute un membre à un arbre.
   *
   * POST /trees/:treeId/members
   *
   * Permission:
   * - OWNER
   *
   * Body:
   * {
   *   email: string,
   *   role: EDITOR | VIEWER
   * }
   */
  app.post(
    "/trees/:treeId/members",
    {
      preHandler: [app.authenticate, app.requireTreeOwner],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const body = request.body as AddTreeMemberInput;

      return addTreeMember(app.prisma, treeId, body);
    },
  );

  /**
   * Modifie le rôle d'un membre.
   *
   * PATCH /trees/:treeId/members/:memberId
   *
   * Permission:
   * - OWNER
   *
   * Body:
   * {
   *   role: EDITOR | VIEWER
   * }
   */
  app.patch(
    "/trees/:treeId/members/:memberId",
    {
      preHandler: [app.authenticate, app.requireTreeOwner],
    },
    async (request) => {
      const { treeId, memberId } = request.params as {
        treeId: string;
        memberId: string;
      };

      const body = request.body as UpdateTreeMemberInput;

      return updateTreeMemberRole(app.prisma, treeId, memberId, body);
    },
  );

  /**
   * Supprime un membre d'un arbre.
   *
   * DELETE /trees/:treeId/members/:memberId
   *
   * Permission:
   * - OWNER
   */
  app.delete(
    "/trees/:treeId/members/:memberId",
    {
      preHandler: [app.authenticate, app.requireTreeOwner],
    },
    async (request) => {
      const { treeId, memberId } = request.params as {
        treeId: string;
        memberId: string;
      };

      await removeTreeMember(app.prisma, treeId, memberId);

      return {
        success: true,
      };
    },
  );

  /**
   * Retourne le rôle d'un utilisateur dans un arbre.
   *
   * GET /trees/:treeId/my-role
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/trees/:treeId/my-role",
    {
      preHandler: [app.authenticate, app.requireTreeMember],
    },
    async (request, reply) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const userId = request.user!.id;

      const member = await app.prisma.treeMember.findFirst({
        where: {
          treeId,
          userId,
        },
        select: {
          role: true,
        },
      });

      if (!member) {
        return reply.code(403).send({
          message: "Forbidden",
        });
      }

      return member;
    },
  );
};

export default treeMembersRoutes;
