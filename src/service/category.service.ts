import { CategoryRepository } from "../repository/category.repository.js";

export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ){}

    async getRelatedCategoryIds(id: string): Promise<string[]> {
        return this.categoryRepository.getRelatedCategoryIds(id)
    }
}