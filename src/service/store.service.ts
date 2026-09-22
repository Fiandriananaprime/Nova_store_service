import { StoreNotFoundError } from "../errorHandler/StoreNotFound.js";
import type { StoreRepository } from "../repository/store.repository.js";
import type { Store } from "../types/store.js";

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

    async getFeaturedStore() {
        const store = await this.storeRepository.getFeaturedStore();
        return store;
    }

    async followStore(storeId: string, userId: string) {
        const store = await this.storeRepository.getStoreById(storeId, userId);
        if (!store) throw new StoreNotFoundError();

        await this.storeRepository.followStore(storeId, userId);
    }

    async unfollowStore(storeId: string, userId: string) {
        const store = await this.storeRepository.getStoreById(storeId, userId);
        if (!store) throw new StoreNotFoundError();
        await this.storeRepository.unfollowStore(storeId, userId);
    }
}