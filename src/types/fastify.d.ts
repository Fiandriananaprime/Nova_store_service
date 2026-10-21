import "fastify"
declare module "fastify" {
  interface FastifyRequest {
    userId: string | null;
    storeId: string | null;
  }
}