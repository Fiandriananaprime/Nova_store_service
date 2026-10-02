import type { FastifyInstance } from "fastify"
import type { StoreController } from "../controller/store.controller.js"
import { userContext } from "../middleware/userContext.js"
import type { CategoryController } from "../controller/category.controller.js"

export const StoreRoute = (
    app: FastifyInstance,
    storeController: StoreController,
    categoryController: CategoryController,
    option: {prefix: string}
) => {
    app.register((route) => {
        route.get("/stores",storeController.findStores.bind(storeController))
        route.get<{Params:{id:string}}>("/stores/:id",{preHandler:userContext},storeController.findStoreById.bind(storeController))
        route.get("/stores/featured",storeController.getFeaturedStores.bind(storeController))
        route.post<{Params:{id:string}}>("/stores/:id/follow",{preHandler:userContext},storeController.followStore.bind(storeController))
        route.delete<{Params:{id:string}}>("/stores/:id/follow",{preHandler:userContext},storeController.unfollowStore.bind(storeController))
        route.get("/categories", categoryController.findAllCategories.bind(categoryController))
        route.get<{Params:{id:string}}>("/categories/:id", categoryController.findCategoryById.bind(categoryController))
    },option)
}