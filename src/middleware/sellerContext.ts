import type { FastifyReply, FastifyRequest } from 'fastify';
import { StoreService } from '../service/store.service.js';
import { StoreNotFoundError } from '../errorHandler/StoreError.js';

export const requireStore = async (
  request: FastifyRequest,
  reply: FastifyReply,
  storeService: StoreService
): Promise<void> => {
  const storeId = request.headers['x-store-id'];
  const sellerId = request.userId;

  if (!storeId || Array.isArray(storeId)) {
    return reply.code(400).send({
      error: 'STORE_ID_REQUIRED',
      message: 'The X-Store-Id header is required.',
    });
  }

  if (!sellerId) {
    return reply.code(401).send({
      error: 'UNAUTHORIZED',
      message: 'Authentication is required.',
    });
  }

  const store = await storeService.findStoreByIdAndSellerId(
    storeId,
    sellerId,
  );

  if (!store) throw new StoreNotFoundError()

  request.storeId = store.id;
}

export const sellerContextHook = (storeService: StoreService) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await requireStore(request, reply, storeService);
  };