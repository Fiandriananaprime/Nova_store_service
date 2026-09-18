import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoreService } from "../service/store.service.js";
import type { GetAllProductsQueryParams } from "../types/store.js";

export class StoreController {
    constructor(
        private readonly storeService: StoreService
    ){}

    async findProducts(request: FastifyRequest<{Querystring:GetAllProductsQueryParams}>,reply:FastifyReply){
        const {page,limit,search,location} = request.query
        const products = await this.storeService.findAllProducts(page,limit,search,location)

        return reply.status(200).send(products)
    }
}