import type { FastifyInstance } from "fastify"
import { userContext } from "../middleware/userContext.js"
import type { SellerStoreController } from "../controller/sellerStore.controller.js"

export const SellerRoute = (
    app: FastifyInstance,
    sellerStoreController: SellerStoreController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get<{Params:{sellerId:string}}>("/seller/stores/:sellerId",{preHandler:userContext},sellerStoreController.getStoreBySellerId.bind(sellerStoreController))
    },option)
    }