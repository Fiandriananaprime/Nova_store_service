import type { FastifyReply, FastifyRequest } from "fastify";
import type { CategoryService } from "../service/category.service.js";

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ){}

    async findAllCategories(_request: FastifyRequest, reply: FastifyReply){
        const categories = await this.categoryService.findAllCategories()
        return reply.status(200).send(categories)
    }
}