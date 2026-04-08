import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exception/httpException";
import { errorResponse } from "../utils/apiResponse";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("GLOBAL ERROR:", err);

    // If it's your custom exception
    if (err instanceof HttpException) {
        return res.status(err.statusCode).json(
            errorResponse(
                err.message,
                err.statusCode,
                null,
                err.extra
            )
        );
    }

    // Fallback error
    return res.status(500).json(
        errorResponse(
            err.message || "Internal server error",
            500
        )
    );
}