import { AppError } from "./AppError.js";

export class InvalidCredentials extends AppError {
    constructor(message: string){
        super(
            "USER UNAUTHENTICATED",
            401,
            message || "user unauthenticated"
        )
    }
}