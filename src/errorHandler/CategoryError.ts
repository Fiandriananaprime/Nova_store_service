import { AppError } from "./AppError.js";

export class CategoryNotFoundError extends AppError {
    constructor(){
        super(
           "CATEGORY_NOT_FOUND",
           404,
           "category not found" 
        );
    }
}