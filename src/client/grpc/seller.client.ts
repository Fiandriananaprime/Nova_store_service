import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";

type SellerBusinessDetails = {
  businessType: string;
  taxId: string;
  registrationNumber: string;
};

let clientPromise: Promise<any> | undefined;

const getClient = async () => {
  if (!clientPromise) {
    clientPromise = (async () => {
      const protoPath = fileURLToPath(new URL("./proto/seller.proto", import.meta.url));
      const packageDefinition = await protoLoader.load(protoPath);
      const grpcObject = grpc.loadPackageDefinition(packageDefinition);
      const sellerPackage = grpcObject["seller"] as any;
      const address = process.env["ADMIN_GRPC_ADDRESS"] || "localhost:50052";
      return new sellerPackage.SellerBusinessService(
        address,
        grpc.credentials.createInsecure(),
      );
    })();
  }

  return clientPromise;
};

export const getSellerBusinessDetails = async (
  sellerId: string,
): Promise<SellerBusinessDetails> => {
  const client = await getClient();

  return new Promise((resolve, reject) => {
    client.GetSellerBusinessDetails(
      { sellerId },
      (error: grpc.ServiceError | null, response: SellerBusinessDetails) => {
        if (error) return reject(error);
        resolve(response);
      },
    );
  });
};
