import { app } from "./app.js";
import "dotenv/config";
import { startGrpcServer } from "./client/grpc/server.js";

const PORT = Number(process.env["PORT"]) || 3001;

const start = async () => {
    try {
        await startGrpcServer();

        const address = await app.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        console.log("Service running at: " + address);
    } catch (error) {
        console.error("Store service failed to start:", error);
        app.log.error(error);
        process.exit(1);
    }
};

process.on("unhandledRejection", (error) => {
    app.log.error(error);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    app.log.error(error);
    process.exit(1);
});

void start();