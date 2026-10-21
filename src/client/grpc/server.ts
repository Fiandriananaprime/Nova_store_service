import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { categoryGrpcService } from "./category.service.js";
import { categorySpecGrpcService } from "./category-spec.service.js";

const require = createRequire(import.meta.url);

export const startGrpcServer = async () => {
    const categoryProtoPath = require.resolve("@Fiandriananaprime/nova_grpc/proto/category.proto");
    const categoryPackageDefinition = await protoLoader.load(categoryProtoPath);
    const categoryGrpcObject = grpc.loadPackageDefinition(categoryPackageDefinition);
    const categoryPackage = categoryGrpcObject["category"] as any;

    const categorySpecProtoPath = fileURLToPath(new URL("./proto/category-spec.proto", import.meta.url));
    const categorySpecPackageDefinition = await protoLoader.load(categorySpecProtoPath);
    const categorySpecGrpcObject = grpc.loadPackageDefinition(categorySpecPackageDefinition);
    const categorySpecPackage = categorySpecGrpcObject["categoryspec"] as any;

    const server = new grpc.Server();
    server.addService(categoryPackage.CategoryService.service, categoryGrpcService);
    server.addService(categorySpecPackage.CategorySpecService.service, categorySpecGrpcService);

    await new Promise<void>((resolve, reject) => {
        server.bindAsync(
            "0.0.0.0:50051",
            grpc.ServerCredentials.createInsecure(),
            (error) => {
                if (error) return reject(error);

                console.log("gRPC server running on port 50051");
                resolve();
            }
        );
    });
};
