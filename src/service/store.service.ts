import type { StoreRepository } from "../repository/store.repository.js";

export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository
    ){}

    async findAllProducts(
        page = 1,
        limit = 10,
        search = "",
        location?: string
    ){
        const products = await this.storeRepository.findStores(search,page,limit,location);

        return products
    }
}