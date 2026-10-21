import { StoreNotFoundError } from "../errorHandler/StoreError.js";
import type { SellerRepository } from "../repository/seller.repository.js";
import type { SellerShippingSettings } from "../types/store.js";

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
}