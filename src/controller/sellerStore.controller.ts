import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoreService } from "../service/store.service.js";
import type { SellerShippingSettings, StoreSettingUpdate } from "../types/store.js";
import type { SellerService } from "../service/seller.service.js";

export class SellerStoreController {
    private readonly storeService: StoreService;
    private readonly sellerService: SellerService;

    constructor(storeService: StoreService, sellerService: SellerService) {
        this.storeService = storeService;
        this.sellerService = sellerService;
    }

    async getStoreBySellerId(request: FastifyRequest,reply: FastifyReply) {
        const sellerId = request.userId;
        if(!sellerId) return reply.code(401).send({ error: "Unauthorized" })
        const stores = this.storeService.getStoreBySellerId(sellerId);

        return reply.status(200).send(stores)
    }

    async getStoreByStoreIdAndSellerId(request:FastifyRequest<{Params:{id: string}}>,reply:FastifyReply){
        const sellerId = request.userId;
        const storeId= request.params.id;

        const store = this.storeService.findStoreById(storeId,sellerId,"SELLER");
        return reply.status(200).send(store)
    }

    async updateByStoreIdAndSellerId(request:FastifyRequest<{Body: StoreSettingUpdate}>,reply:FastifyReply){
        const sellerId = request.userId;
        const storeId= request.storeId;
        const updateData = request.body;
        if(!sellerId || !storeId) return reply.code(401).send({ error: "Unauthorized" })

        const store = await this.storeService.updateByIdAndSellerId(storeId,sellerId,updateData);

        return reply.status(200).send(store)
    }

    async getShippingSettingsBySellerId(request: FastifyRequest,reply: FastifyReply){
        const sellerId = request.userId;
        const storeId = request.storeId;
        if(!sellerId || !storeId) return reply.code(401).send({ error: "Unauthorized" })
        const shippingSettings = await this.sellerService.getShippingSettingsBySellerId(sellerId,storeId);
        return reply.status(200).send(shippingSettings);
    }

    async updateShippingSettingsBySellerId(request: FastifyRequest<{Params:{id: string},Body: SellerShippingSettings}>,reply: FastifyReply){
        const sellerId = request.userId;
        const storeId= request.params.id;
        const updateData = request.body;
        if(!sellerId) return reply.code(401).send({ error: "Unauthorized" })
        const updatedSettings = await this.sellerService.updateShippingSettingsBySellerId(storeId,sellerId,updateData);
        return reply.status(200).send(updatedSettings);
    }
        
}