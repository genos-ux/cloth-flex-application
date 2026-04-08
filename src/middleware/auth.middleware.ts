import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils/httpStatus";
import {BadRequestException, UnauthorizedException} from "../utils/exception";

interface JwtPayload {
  id: string;
  role: "admin" | "customer";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function ensureAuthenticated(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new UnauthorizedException(
      "Authentication required"
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    throw new BadRequestException(
      "Invalid or expired token",
      HttpStatus.UNAUTHORIZED
    );
  }
}


export function isAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new BadRequestException(
      "Authentication required",
      HttpStatus.UNAUTHORIZED
    );
  }

  if (req.user.role !== "admin") {
    throw new BadRequestException(
      "Admin access required",
      HttpStatus.FORBIDDEN
    );
  }

  next();
}