import { AppError } from "./AppError.js";

export class StoreNotFoundError extends AppError {
    constructor(){
        super(
           "STORE_NOT_FOUND",
           404,
           "store not found" 
        );
    }
}