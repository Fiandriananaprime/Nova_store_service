import { prisma } from "../database/prisma.js";

export type CategoryTree = {
  id: string;
  children: CategoryTree[];
};
export class CategoryRepository {
    async getCategoryTree(id: string): Promise<CategoryTree> {
        const categories = await prisma.category.findMany({
            select: { id: true, parentId: true },
        });

        const map = new Map(categories.map(c => [c.id, c]));

        if (!map.has(id)) throw new Error("Category not found");

        let rootId = id;

        while (map.get(rootId)?.parentId) {
            rootId = map.get(rootId)!.parentId!;
        }

        const build = (id: string): CategoryTree => ({
            id,
            children: categories
                .filter(category => category.parentId === id)
                .map(category => build(category.id)),
        });

        return build(rootId);
    }
}