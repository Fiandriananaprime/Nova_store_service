import { prisma } from "../database/prisma.js";

export class CategoryRepository {
    
    async findAllCategories() {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                parentId: true,
            },
        });
        return categories;
    }

    async getRelatedCategoryIds(id: string): Promise<string[]> {
        const categories = await prisma.category.findMany({
            select: { id: true, parentId: true },
        });

        const map = new Map(categories.map(category => [category.id, category]));

        if (!map.has(id)) {
            throw new Error("Category not found");
        }

        const visited = new Set<string>();
        const queue = [id];

        while (queue.length > 0) {
            const currentId = queue.shift()!;

            if (visited.has(currentId)) continue;
            visited.add(currentId);

            const current = map.get(currentId);
            if (!current) continue;

            const parentId = current.parentId;
            if (parentId && !visited.has(parentId)) {
                queue.push(parentId);
            }

            const children = categories.filter(category => category.parentId === currentId);
            for (const child of children) {
                if (!visited.has(child.id)) {
                    queue.push(child.id);
                }
            }
        }

        return Array.from(visited);
    }
}