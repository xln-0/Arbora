import type { FastifyPluginAsync } from "fastify";

import type { CreatePersonInput, UpdatePersonInput } from "@arbora/shared";

import {
  createPerson,
  getPersonsByTree,
  getPerson,
  updatePerson,
  deletePerson,
  updatePersonPosition,
} from "../services/personsService.js";

const personsRoutes: FastifyPluginAsync = async (app) => {
  /**
   * Ajoute une personne dans un arbre.
   *
   * POST /trees/:treeId/persons
   *
   * Permission:
   * - OWNER
   * - EDITOR
   *
   * Body:
   * {
   *   firstName: string,
   *   lastName?: string,
   *   gender?: Gender,
   *   birthDate?: string,
   *   deathDate?: string
   * }
   */
  app.post(
    "/trees/:treeId/persons",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const body = request.body as CreatePersonInput;

      return createPerson(app.prisma, treeId, body);
    },
  );

  /**
   * Retourne toutes les personnes d'un arbre.
   *
   * GET /trees/:treeId/persons
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/trees/:treeId/persons",
    {
      preHandler: [app.authenticate, app.requireTreeMember],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      return getPersonsByTree(app.prisma, treeId);
    },
  );

  /**
   * Retourne une personne.
   *
   * GET /trees/:treeId/persons/:personId
   *
   * Permission:
   * - OWNER
   * - EDITOR
   * - VIEWER
   */
  app.get(
    "/trees/:treeId/persons/:personId",
    {
      preHandler: [app.authenticate, app.requireTreeMember],
    },
    async (request) => {
      const { treeId, personId } = request.params as {
        treeId: string;
        personId: string;
      };

      return getPerson(app.prisma, treeId, personId);
    },
  );

  /**
   * Modifie une personne.
   *
   * PATCH /trees/:treeId/persons/:id
   *
   * Permission:
   * - OWNER
   * - EDITOR
   */
  app.patch(
    "/trees/:treeId/persons/:personId",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId, personId } = request.params as {
        treeId: string;
        personId: string;
      };

      const body = request.body as UpdatePersonInput;

      return updatePerson(app.prisma, treeId, personId, body);
    },
  );

  /**
   * Supprime une personne.
   *
   * DELETE /trees/:treeId/persons/:personId
   *
   * Permission:
   * - OWNER
   * - EDITOR
   */
  app.delete(
    "/trees/:treeId/persons/:personId",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId, personId } = request.params as {
        treeId: string;
        personId: string;
      };

      return deletePerson(app.prisma, treeId, personId);
    },
  );

  /**
   * Met à jour la position graphique d'une personne.
   *
   * PATCH /trees/:treeId/persons/:personId/position
   *
   * Utilisé par:
   * - React Flow
   *
   * Permission:
   * - OWNER
   * - EDITOR
   *
   * Body:
   * {
   *   x: number,
   *   y: number
   * }
   */
  app.patch(
    "/trees/:treeId/persons/:personId/position",
    {
      preHandler: [app.authenticate, app.requireTreeEditor],
    },
    async (request) => {
      const { treeId, personId } = request.params as {
        treeId: string;
        personId: string;
      };

      const body = request.body as {
        x: number;
        y: number;
      };

      return updatePersonPosition(app.prisma, treeId, personId, body);
    },
  );
};

export default personsRoutes;
