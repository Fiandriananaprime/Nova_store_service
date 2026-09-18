import type { FastifyRequest } from "fastify";

export  const userContext = (request: FastifyRequest) => {
  const userId = request.headers["X-User-Id"];

  request.userId = typeof userId === "string"
    ? userId
    : null;
}