import type { FastifyInstance } from "fastify";
import { StoreRepository } from "./repository/store.repository.js";
import { StoreService } from "./service/store.service.js";
import { StoreController } from "./controller/store.controller.js";
import { StoreRoute } from "./routes/store.route.js";

export const routes = (app: FastifyInstance) => {
    //Dependencies
    const storeRepository = new StoreRepository();

    //Services
    const storeService = new StoreService(storeRepository);

    //Controller
    const storeController = new StoreController(storeService);

    StoreRoute(app,storeController,{prefix: "/api"})
};