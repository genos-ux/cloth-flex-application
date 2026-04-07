import { HttpStatus } from "../httpStatus";

export class HttpException extends Error {
  public statusCode: number;
  public extra?: Record<string, any>;

  constructor(
    message: string,
    statusCode: HttpStatus,
    extra: Record<string, any> = {}
  ) {
    super(message);

    this.statusCode = statusCode;
    this.extra = extra;

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}