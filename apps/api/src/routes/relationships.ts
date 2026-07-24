import type { FastifyPluginAsync } from "fastify";

import {
  createRelationship,
  getRelationshipsByTree,
  deleteRelationship,
} from "../services/relationshipsService.js";

import { relationships, type RelationshipType } from "@arbora/shared";

interface CreateRelationshipParams {
  treeId: string;
}

interface CreateRelationshipBody {
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationshipType;
}

const relationshipsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{
    Params: CreateRelationshipParams;
    Body: CreateRelationshipBody;
  }>("/trees/:treeId/relationships", async (request, reply) => {
    const { treeId } = request.params;

    const { sourcePersonId, targetPersonId, type } = request.body;

    if (!sourcePersonId || !targetPersonId) {
      return reply.status(400).send({
        message: "Source and target persons are required",
      });
    }

    if (sourcePersonId === targetPersonId) {
      return reply.status(400).send({
        message: "A person cannot be related to itself",
      });
    }

    if (!Object.values(relationships).includes(type)) {
      return reply.status(400).send({
        message: "Invalid relationship type",
      });
    }

    const relationship = await createRelationship(app.prisma, treeId, {
      sourcePersonId,
      targetPersonId,
      type,
    });

    return reply.status(201).send(relationship);
  });

  app.get("/trees/:treeId/relationships", async (request) => {
    const { treeId } = request.params as {
      treeId: string;
    };

    return getRelationshipsByTree(app.prisma, treeId);
  });

  app.delete("/relationships/:id", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    return deleteRelationship(app.prisma, id);
  });
};

export default relationshipsRoutes;
