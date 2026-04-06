import type { Request, Response, NextFunction } from "express";

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

      /*
        If controller returned something,
        send it as JSON
      */
      if (result) {
        return res
          .status(result.statusCode || 200)
          .json(result);
      }
    } catch (error) {
      next(error);
    }
  };
}