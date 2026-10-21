import grpc from "@grpc/grpc-js";
import { CategoryRepository } from "../../repository/category.repository.js";

type GetCategorySpecsRequest = {
    categoryId: string;
};

type CategorySpecGrpcItem = {
    id: string;
    categoryId: string;
    key: string;
    name: string;
    type: string;
    required: boolean;
    filterable: boolean;
    searchable: boolean;
    optionsJson: string;
};

type GetCategorySpecsResponse = {
    categoryId: string;
    specs: CategorySpecGrpcItem[];
};

type CategorySpecGrpcHandlers = {
    GetCategorySpecs: grpc.handleUnaryCall<GetCategorySpecsRequest, GetCategorySpecsResponse>;
};

const repository = new CategoryRepository();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const grpcError = (code: number, message: string): grpc.ServiceError =>
    Object.assign(new Error(message), {
        code,
        details: message,
        metadata: new grpc.Metadata(),
    });

export const categorySpecGrpcService: CategorySpecGrpcHandlers = {
    GetCategorySpecs: (call, callback) => {
        const { categoryId } = call.request;

        if (!uuidPattern.test(categoryId)) {
            callback(grpcError(grpc.status.INVALID_ARGUMENT, "categoryId must be a UUID."));
            return;
        }

        void repository.getCategoryById(categoryId)
            .then((category) => {
                if (!category) {
                    callback(grpcError(grpc.status.NOT_FOUND, "Category not found."));
                    return;
                }

                callback(null, {
                    categoryId: category.id,
                    specs: category.specs.map((spec) => ({
                        id: spec.id,
                        categoryId: spec.categoryId,
                        key: spec.key,
                        name: spec.name,
                        type: spec.type,
                        required: spec.required,
                        filterable: spec.filterable,
                        searchable: spec.searchable,
                        optionsJson: spec.options === null ? "" : JSON.stringify(spec.options) ?? "",
                    })),
                });
            })
            .catch((error: unknown) => {
                console.error("Store category-specs gRPC request failed:", error);
                callback(grpcError(grpc.status.INTERNAL, "Unable to retrieve category specifications."));
            });
    },
};
