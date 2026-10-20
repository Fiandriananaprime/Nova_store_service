import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoreService } from "../service/store.service.js";

export class SellerStoreController {
    private readonly storeService: StoreService;

    constructor(storeService: StoreService) {
        this.storeService = storeService;
    }

    async getStoreBySellerId(request: FastifyRequest,reply: FastifyReply) {
        const sellerId = request.userId;
        if(!sellerId) return reply.code(401).send({ error: "Unauthorized" })
        const stores = this.storeService.getStoreBySellerId(sellerId);

        return reply.status(200).send(stores)
    }
}