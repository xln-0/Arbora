import type { FastifyPluginAsync } from "fastify";

import {
  createPerson,
  getPersonsByTree,
  getPerson,
  updatePerson,
  deletePerson,
} from "../services/personsService.js";
import { Gender } from "@arbora/shared";

const personsRoutes: FastifyPluginAsync = async (app) => {
  // Ajouter une personne dans un arbre

  app.post(
    "/trees/:treeId/persons",
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { treeId } = request.params as {
        treeId: string;
      };

      const body = request.body as {
        firstName: string;
        lastName?: string;
        gender?: Gender;
        birthDate?: string;
      };

      return createPerson(app.prisma, treeId, body as any);
    },
  );

  // Liste des personnes d'un arbre
  app.get("/trees/:treeId/persons", async (request) => {
    const { treeId } = request.params as {
      treeId: string;
    };

    return getPersonsByTree(app.prisma, treeId);
  });

  // Une personne

  app.get("/persons/:id", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    return getPerson(app.prisma, id);
  });

  // Modifier

  app.patch("/persons/:id", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    const body = request.body as {
      firstName: string;
      lastName?: string;
      gender: Gender;
      birthDate?: string;
    };

    return updatePerson(app.prisma, id, body as any);
  });

  // Supprimer

  app.delete("/persons/:id", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    return deletePerson(app.prisma, id);
  });

  // Patch position

  app.patch("/persons/:id/position", async (request) => {
    const { id } = request.params as {
      id: string;
    };

    const body = request.body as {
      x: number;
      y: number;
    };

    return app.prisma.person.update({
      where: {
        id,
      },

      data: {
        positionX: body.x,
        positionY: body.y,
      },
    });
  });
};

export default personsRoutes;
