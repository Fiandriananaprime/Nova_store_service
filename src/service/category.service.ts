import { CategoryRepository, type CategoryTree } from "../repository/category.repository.js";

export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ){}

    async getRelatedCategoryIds(id: string): Promise<CategoryTree>{
        return this.categoryRepository.getCategoryTree(id)
    }
}