import type { FastifyInstance } from "fastify"
import { userContext } from "../middleware/userContext.js"
import type { SellerStoreController } from "../controller/sellerStore.controller.js"
import type { SellerShippingSettings, StorePolicies, StoreSettingUpdate } from "../types/store.js"
import { sellerContextHook } from "../middleware/sellerContext.js"
import type { StoreService } from "../service/store.service.js"

export const SellerRoute = (
    app: FastifyInstance,
    sellerStoreController: SellerStoreController,
    storeService: StoreService,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",{preHandler:userContext},sellerStoreController.getStoreBySellerId.bind(sellerStoreController))
        route.get<{Params: { id: string}}>("stores/:id",{preHandler:userContext},sellerStoreController.getStoreByStoreIdAndSellerId.bind(sellerStoreController))
        route.patch<{Body: StoreSettingUpdate}>("stores",{preHandler:[userContext,sellerContextHook(storeService)]},sellerStoreController.updateByStoreIdAndSellerId.bind(sellerStoreController))
        route.get("/settings/shipping",{preHandler:userContext},sellerStoreController.getShippingSettingsBySellerId.bind(sellerStoreController))
        route.patch<{Params: { id: string},Body: SellerShippingSettings}>("settings/shipping/:id",{preHandler:userContext},sellerStoreController.updateShippingSettingsBySellerId.bind(sellerStoreController))
        route.get("/store/policies",{preHandler:[userContext,sellerContextHook(storeService)]}, sellerStoreController.getStorePolicies.bind(sellerStoreController))
        route.patch<{Body: StorePolicies}>("/store/policies",{preHandler:[userContext,sellerContextHook(storeService)]}, sellerStoreController.updateStorePolicies.bind(sellerStoreController))
    },option)
    }