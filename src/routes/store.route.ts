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
        route.get("/buyer/favorites/stores",{preHandler:userContext},storeController.getFollowedStores.bind(storeController))
        route.post<{Params:{storeId:string}}>("/buyer/favorites/stores/:storeId",{
            preHandler:userContext,
            schema:{
                params:{
                    type:"object",
                    required:["storeId"],
                    properties:{storeId:{type:"string",format:"uuid"}},
                },
            },
        },storeController.followStore.bind(storeController))
        route.delete<{Params:{storeId:string}}>("/buyer/favorites/stores/:storeId",{
            preHandler:userContext,
            schema:{
                params:{
                    type:"object",
                    required:["storeId"],
                    properties:{storeId:{type:"string",format:"uuid"}},
                },
            },
        },storeController.unfollowStore.bind(storeController))
        route.get("/categories", categoryController.findAllCategories.bind(categoryController))
        route.get<{Params:{id:string}}>("/categories/:id", categoryController.findCategoryById.bind(categoryController))
    },option)
}