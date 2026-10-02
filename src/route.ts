import type { FastifyInstance } from "fastify";
import { StoreRepository } from "./repository/store.repository.js";
import { StoreService } from "./service/store.service.js";
import { StoreController } from "./controller/store.controller.js";
import { StoreRoute } from "./routes/store.route.js";
import { CategoryRepository } from "./repository/category.repository.js";
import { CategoryService } from "./service/category.service.js";
import { CategoryController } from "./controller/category.controller.js";

export const routes = (app: FastifyInstance) => {
    //Dependencies
    const storeRepository = new StoreRepository();
    const categoryRepository = new CategoryRepository();

    //Services
    const storeService = new StoreService(storeRepository);
    const categoryService = new CategoryService(categoryRepository);

    //Controller
    const storeController = new StoreController(storeService);
    const categoryController = new CategoryController(categoryService);

    StoreRoute(app,storeController,categoryController,{prefix: "/api"})
};