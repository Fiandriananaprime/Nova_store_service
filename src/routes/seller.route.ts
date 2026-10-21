import type { FastifyInstance } from "fastify"
import { userContext } from "../middleware/userContext.js"
import type { SellerStoreController } from "../controller/sellerStore.controller.js"
import type { StoreSettingUpdate } from "../types/store.js"

export const SellerRoute = (
    app: FastifyInstance,
    sellerStoreController: SellerStoreController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",{preHandler:userContext},sellerStoreController.getStoreBySellerId.bind(sellerStoreController))
        route.get<{Params: { id: string}}>("stores/:id",{preHandler:userContext},sellerStoreController.getStoreByStoreIdAndSellerId.bind(sellerStoreController))
        route.patch<{Params: { id: string},Body: StoreSettingUpdate}>("stores/:id",{preHandler:userContext},sellerStoreController.updateByStoreIdAndSellerId.bind(sellerStoreController))
    },option)
    }