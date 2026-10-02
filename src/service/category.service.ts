import { CategoryNotFoundError } from "../errorHandler/CategoryError.js";
import { CategoryRepository } from "../repository/category.repository.js";
import type { CategoryDetail, CategoryTree } from "../types/category.js";

export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ){}

    async findAllCategories(): Promise<CategoryTree[]> {
        const categories = await this.categoryRepository.findAllCategories();

        const categoryMap = new Map<string, CategoryTree>(
            categories.map(category => [
                category.id,
                {
                    id: category.id,
                    name: category.name,
                    children: [],
                },
            ]),
        );

        const roots: CategoryTree[] = [];

        for (const category of categories) {
            const current = categoryMap.get(category.id);

            if (!current) continue;

            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);

                if (parent) {
                    parent.children.push(current);
                }
            } else {
                roots.push(current);
            }
        }

        return roots;
    }
    async getRelatedCategoryIds(id: string): Promise<string[]> {
        return this.categoryRepository.getRelatedCategoryIds(id)
    }
    
    async getCategoryById(id: string): Promise<CategoryDetail> {
        const category = await this.categoryRepository.getCategoryById(id);
        if (!category) throw new CategoryNotFoundError();
        return category;
    }
}