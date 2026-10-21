import type { FastifyInstance } from "fastify"
import { userContext } from "../middleware/userContext.js"
import type { SellerStoreController } from "../controller/sellerStore.controller.js"
import type { SellerShippingSettings, StoreSettingUpdate } from "../types/store.js"

export const SellerRoute = (
    app: FastifyInstance,
    sellerStoreController: SellerStoreController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",{preHandler:userContext},sellerStoreController.getStoreBySellerId.bind(sellerStoreController))
        route.get<{Params: { id: string}}>("stores/:id",{preHandler:userContext},sellerStoreController.getStoreByStoreIdAndSellerId.bind(sellerStoreController))
        route.patch<{Body: StoreSettingUpdate}>("stores",{preHandler:userContext},sellerStoreController.updateByStoreIdAndSellerId.bind(sellerStoreController))
        route.get("/settings/shipping",{preHandler:userContext},sellerStoreController.getShippingSettingsBySellerId.bind(sellerStoreController))
        route.patch<{Params: { id: string},Body: SellerShippingSettings}>("settings/shipping/:id",{preHandler:userContext},sellerStoreController.updateShippingSettingsBySellerId.bind(sellerStoreController))
    },option)
    }