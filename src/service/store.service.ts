import { StoreNotFoundError } from "../errorHandler/StoreNotFound.js";
import type { StoreRepository } from "../repository/store.repository.js";
import type { Store, StoreSummary } from "../types/store.js";

export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository
    ){}

    async findAllStores(
        page = 1,
        limit = 10,
        search = "",
        location?: string
    ){
        const products = await this.storeRepository.findStores(search,page,limit,location);

        return products
    }

    async findStoreById(id: string, userId: string | null) : Promise<Store>{
        const store = await this.storeRepository.getStoreById(id,userId);

        if(!store) throw new StoreNotFoundError()

        return store
    }

    async getFeaturedStore(): Promise<StoreSummary[]>{
        const store = await this.storeRepository.getFeaturedStore();
        return store
    }
}