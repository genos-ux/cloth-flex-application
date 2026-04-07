import type { Request, Response, NextFunction } from "express";
import { HttpException } from "./exception/httpException";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  extra?: Record<string, any>;
}

export function successResponse<T>(
  message: string,
  data: T,
  statusCode: number = 200,
  extra: Record<string, any> = {}
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
    extra,
  };
}

export function errorResponse<T>(
  message: string,
  statusCode: number = 400,
  data: T | null = null,
  extra: Record<string, any> = {}
): ApiResponse<T> {
  return {
    success: false,
    message,
    data,
    statusCode,
    extra,
  };
}


export function handler(
  controller: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await controller(
        req,
        res,
        next
      );

      if (result) {
        return res
          .status(result.statusCode || 200)
          .json(result);
      }
    } catch (error: any) {
      console.error("ERROR:", error);

      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(
          errorResponse(
            error.message,
            error.statusCode,
            null,
            error.extra
          )
        );
      }

      return res.status(500).json(
        errorResponse(
          error.message || "Internal server error",
          500
        )
      );
    }
  }
}