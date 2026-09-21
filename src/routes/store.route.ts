import type { FastifyInstance } from "fastify"
import type { StoreController } from "../controller/store.controller.js"
import { userContext } from "../middleware/userContext.js"

export const StoreRoute = (
    app: FastifyInstance,
    storeController: StoreController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",storeController.findStores.bind(storeController))
        route.get<{Params:{id:string}}>("/stores/:id",{preHandler:userContext},storeController.findStoreById.bind(storeController))
        route.get("/stores/featured",storeController.getFeaturedStores.bind(storeController))
    },option)
}