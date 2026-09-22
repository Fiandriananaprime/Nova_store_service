import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { createRequire } from "node:module";
import { categoryGrpcService } from "./category.service.js";

const require = createRequire(import.meta.url);

export  const startGrpcServer = async () => {
    const protoPath = require.resolve( "@Fiandriananaprime/nova_grpc/proto/category.proto");

    const packageDefinition = await protoLoader.load(protoPath);
    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    const categoryPackage = grpcObject["category"] as any;

    const server = new grpc.Server();

    server.addService( categoryPackage.CategoryService.service, categoryGrpcService );

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
}