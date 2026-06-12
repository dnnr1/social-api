import type { Request, Response, NextFunction } from "express";
import AppError from "../appError.js";
import { HTTP_TOO_MANY_REQUESTS } from "../constants/httpStatus.js";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const ONE_MINUTE_MS = 60 * 1000;

export function rateLimiter(maxRequests: number = 60, windowMs: number = ONE_MINUTE_MS) {
  return (req: Request, _: Response, next: NextFunction) => {
    const key = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxRequests) {
      throw new AppError(
        "Too many requests. Please try again later.",
        HTTP_TOO_MANY_REQUESTS,
      );
    }

    next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, ONE_MINUTE_MS);
