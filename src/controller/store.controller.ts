import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoreService } from "../service/store.service.js";
import type { GetAllProductsQueryParams } from "../types/store.js";

export class StoreController {
    constructor(
        private readonly storeService: StoreService
    ){}

    async findStores(request: FastifyRequest<{Querystring:GetAllProductsQueryParams}>,reply:FastifyReply){
        const {page,limit,search,location} = request.query
        const products = await this.storeService.findAllStores(page,limit,search,location)

        return reply.status(200).send(products)
    }

    async findStoreById(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply){
        const {id} = request.params
        const userId = request.userId
        const store = await this.storeService.findStoreById(id,userId)

        return reply.status(200).send(store)
    }

    async getFeaturedStores(_request: FastifyRequest, reply:FastifyReply){
        const featuredStore = await this.storeService.getFeaturedStore();

        return reply.status(200).send(featuredStore);
    }
}