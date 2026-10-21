import { StoreNotFoundError } from "../errorHandler/StoreError.js";
import type { StoreRepository } from "../repository/store.repository.js";
import type { Store, StoreSettings, StoreSettingUpdate, StoreSummary } from "../types/store.js";
import type { role } from "../types/userRole.js";
import { getSellerBusinessDetails } from "../client/grpc/seller.client.js";
import { InvalidCredentials } from "../errorHandler/InvalidCredentials.js";

export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository
    ){}

    getFollowedStores(userId: string): Promise<Store[]> {
        return this.storeRepository.getFollowedStores(userId);
    }

    async findAllStores(
        page = 1,
        limit = 10,
        search = "",
        location?: string
    ){
        const products = await this.storeRepository.findStores(search,page,limit,location);

        return products
    }

    async findStoreById(id: string, userId: string | null,role:role) : Promise<Store | StoreSettings>{
        const store = await this.storeRepository.getStoreById(id,userId,role);

        if(!store) throw new StoreNotFoundError()
        if(role == "SELLER"){
            if(!userId) throw new InvalidCredentials("Seller not authenticated")
            const detail = await getSellerBusinessDetails(userId);

            return {
                ...store,
                taxId: detail.taxId,
                registrationNumber:detail.registrationNumber,
                businessType:detail.businessType
            }
        }
        return store
    }

    async getFeaturedStore() {
        const store = await this.storeRepository.getFeaturedStore();
        return store;
    }

    async followStore(storeId: string, userId: string) {
        const store = await this.storeRepository.getStoreById(storeId, userId,"BUYER");
        if (!store) throw new StoreNotFoundError();

        await this.storeRepository.followStore(storeId, userId);
    }

    async unfollowStore(storeId: string, userId: string) {
        const store = await this.storeRepository.getStoreById(storeId, userId,"BUYER");
        if (!store) throw new StoreNotFoundError();
        await this.storeRepository.unfollowStore(storeId, userId);
    }

    async getStoreBySellerId(sellerId: string): Promise<StoreSummary[]> {
        const store = await this.storeRepository.getStoreBySellerId(sellerId);
        return store;
    }

    async updateByIdAndSellerId(storeId: string, sellerId: string, updateData: StoreSettingUpdate): Promise<StoreSettings> {
        const updatedStore = await this.storeRepository.updateByIdAndSellerId(storeId, sellerId, updateData);
        if(!updatedStore) throw new StoreNotFoundError();
        return updatedStore;

    }

    async findStoreByIdAndSellerId(storeId: string, sellerId: string) {
        const store = await this.storeRepository.getStoreById(storeId, sellerId,"SELLER")
        return store
    }

    async getShippingSettingsBySellerId(storeId: string, sellerId: string){
        const shippingSetting = await this.storeRepository.getShippingSetting(storeId, sellerId);
        if(!shippingSetting) throw new StoreNotFoundError()
        return shippingSetting
    }

    async updateShippingSettingsBySellerId(storeId: string, sellerId: string){
        const shippingSetting = await this.storeRepository.updateShippingSetting(storeId, sellerId);
        if(!shippingSetting) throw new StoreNotFoundError();

        return shippingSetting

    }
}