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