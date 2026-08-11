import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

import { AppError } from "./AppError.js";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    request.log.warn(error);

    return reply.status(400).send({
      code: "INVALID_INPUT",
      message: "Invalid request payload",
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    request.log.warn(error);

    if (error.code === "P2002") {
      return reply.status(409).send({
        code: "CONFLICT",
        message: "A record with these values already exists",
      });
    }

    if (error.code === "P2025") {
      return reply.status(404).send({
        code: "NOT_FOUND",
        message: "Record not found",
      });
    }

    return reply.status(500).send({
      code: "DATABASE_ERROR",
      message: "Database error",
    });
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    request.log.error(error);

    return reply.status(500).send({
      code: "DATABASE_ERROR",
      message: "Database error",
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}
