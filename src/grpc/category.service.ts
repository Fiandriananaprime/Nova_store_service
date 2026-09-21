import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository);

export const categoryGrpcService = {
    GetRelatedCategoryIds: async (call: any, callback: any) => {
        try {
            const { categoryId } = call.request;

            const categoryIds =
                await categoryService.getRelatedCategoryIds(categoryId);

            callback(null, { categoryIds });
        } catch (error) {
            callback(error);
        }
    }
};