
import { HttpStatus } from "../httpStatus";
import { HttpException } from "./httpException";

export class BadRequestException extends HttpException {
  constructor(
    message: string = "Bad Request",
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(
    message: string = "Unauthorized"
  ) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(
    message: string = "Forbidden"
  ) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message: string = "Resource not found"
  ) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(
    message: string = "Resource already exists"
  ) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InternalServerException extends HttpException {
  constructor(
    message: string = "Internal server error"
  ) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}