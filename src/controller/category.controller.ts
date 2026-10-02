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

    async findCategoryById(request: FastifyRequest<{Params:{id: string}}>, reply: FastifyReply){
        const categoryId = request.params.id;
        const category = await this.categoryService.getCategoryById(categoryId);
        return reply.status(200).send(category);
    }
}