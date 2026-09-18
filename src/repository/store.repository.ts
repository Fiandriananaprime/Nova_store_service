import { prisma } from "../database/prisma.js";
import type { StoreSummary } from "../types/store.js";

export class StoreRepository {

    async findStores(search: string, page: number, limit: number, location?: string): Promise<StoreSummary[]> {
        const stores = await prisma.store.findMany({
            where: {
            ...(search && { name: { contains: search, mode: "insensitive" } }),
            ...(location && { location: { contains: location, mode: "insensitive" } }),
            },
            select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            verified: true,
            rating: true,
            reviewsCount: true,
            productsCount: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

         return stores.map(store => ({
            ...store,
            rating: Number(store.rating),
        }));
    }
}