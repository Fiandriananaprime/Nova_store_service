import type { FastifyInstance } from "fastify"
import type { StoreController } from "../controller/store.controller.js"

export const StoreRoute = (
    app: FastifyInstance,
    storeController: StoreController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",storeController.findProducts.bind(storeController))
    })
}