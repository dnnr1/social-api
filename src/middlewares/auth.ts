import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/types.js";
import AppError from "../appError.js";
import { config } from "../config/index.js";
import { HTTP_UNAUTHORIZED } from "../constants/httpStatus.js";

function extractToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies?.access_token;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    throw new AppError("Token is missing!", HTTP_UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    req.user = decoded as TokenPayload;
  } catch (error) {
    throw new AppError("Invalid Token", HTTP_UNAUTHORIZED);
  }

  next();
}

export function optionalAuth(req: Request, _: Response, next: NextFunction) {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret as string);
      req.user = decoded as TokenPayload;
    } catch {
    }
  }

  next();
}

export default authMiddleware;
