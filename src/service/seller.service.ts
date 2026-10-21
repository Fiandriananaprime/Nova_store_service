import { StoreNotFoundError } from "../errorHandler/StoreError.js";
import type { SellerRepository } from "../repository/seller.repository.js";
import type { SellerShippingSettings, StorePolicies } from "../types/store.js";

export class SellerService {
    private readonly sellerRepository: SellerRepository;

    constructor(repo: SellerRepository){
        this.sellerRepository= repo;
    }

    async getShippingSettingsBySellerId(storeId: string, sellerId: string){
        const shippingSetting = await this.sellerRepository.getShippingSetting(storeId, sellerId);
        if(!shippingSetting) throw new StoreNotFoundError()
        return shippingSetting
    }

    async updateShippingSettingsBySellerId(storeId: string, sellerId: string,data: SellerShippingSettings){
        const shippingSetting = await this.sellerRepository.updateShippingSetting(storeId, sellerId,data);
        if(!shippingSetting) throw new StoreNotFoundError();

        return shippingSetting
    }

    async getStorePolicies(storeId: string, sellerId: string): Promise<StorePolicies> {
        const storePolicies = await this.sellerRepository.getStorePolicies(storeId, sellerId);
        if(!storePolicies) throw new StoreNotFoundError();
        return storePolicies;
    }

    async updateStorePolicies(storeId: string, sellerId: string, data: Partial<StorePolicies>): Promise<StorePolicies> {
        const updatedPolicies = await this.sellerRepository.updateStorePolicies(storeId, sellerId, data);
        if(!updatedPolicies) throw new StoreNotFoundError();
        return updatedPolicies;
    }
}