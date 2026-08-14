import type { FastifyPluginAsync } from "fastify";

import type { CreateEventInput, UpdateEventInput } from "@arbora/shared";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEventsByTree,
  updateEvent,
} from "../services/eventsService.js";

const eventsRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/trees/:treeId/events",
    { preHandler: [app.authenticate, app.requireTreeEditor] },
    async (request, reply) => {
      const { treeId } = request.params as { treeId: string };
      const event = await createEvent(
        app.prisma,
        treeId,
        request.body as CreateEventInput,
      );

      return reply.status(201).send(event);
    },
  );

  app.get(
    "/trees/:treeId/events",
    { preHandler: [app.authenticate, app.requireTreeMember] },
    async (request) => {
      const { treeId } = request.params as { treeId: string };
      return getEventsByTree(app.prisma, treeId);
    },
  );

  app.get(
    "/trees/:treeId/events/:eventId",
    { preHandler: [app.authenticate, app.requireTreeMember] },
    async (request) => {
      const { treeId, eventId } = request.params as {
        treeId: string;
        eventId: string;
      };
      return getEvent(app.prisma, treeId, eventId);
    },
  );

  app.patch(
    "/trees/:treeId/events/:eventId",
    { preHandler: [app.authenticate, app.requireTreeEditor] },
    async (request) => {
      const { treeId, eventId } = request.params as {
        treeId: string;
        eventId: string;
      };
      return updateEvent(
        app.prisma,
        treeId,
        eventId,
        request.body as UpdateEventInput,
      );
    },
  );

  app.delete(
    "/trees/:treeId/events/:eventId",
    { preHandler: [app.authenticate, app.requireTreeEditor] },
    async (request) => {
      const { treeId, eventId } = request.params as {
        treeId: string;
        eventId: string;
      };
      return deleteEvent(app.prisma, treeId, eventId);
    },
  );
};

export default eventsRoutes;
